/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Observable } from 'rxjs';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import pick from 'lodash/pick';
import uniqBy from 'lodash/uniqBy';
import castArray from 'lodash/castArray';
import {
    getResources,
    getFeaturedResources,
    getResourceByUuid,
    getResourceByTypeAndByPk,
    getFacetItems
} from '@js/api/geonode/v2';
import {
    SEARCH_RESOURCES,
    REQUEST_RESOURCE,
    updateResources,
    loadingResources,
    updateResourcesMetadata,
    setFeaturedResources,
    UPDATE_FEATURED_RESOURCES,
    requestResource,
    GET_FACET_ITEMS,
    setFacetItems,
    getFacetFilters,
    GET_FACET_FILTERS,
    setFilters
} from '@js/actions/gnsearch';
import {
    resourceLoading,
    setResource,
    resourceError
} from '@js/actions/gnresource';
import {
    LOCATION_CHANGE,
    push
} from 'connected-react-router';
import url from 'url';
import { getCustomMenuFilters } from '@js/selectors/config';
import {
    STOP_ASYNC_PROCESS,
    startAsyncProcess
} from '@js/actions/resourceservice';
import {
    ProcessTypes,
    ProcessStatus,
    extractExecutionsFromResources
} from '@js/utils/ResourceServiceUtils';
import { userSelector } from '@mapstore/framework/selectors/security';
import { getResourceData } from '@js/selectors/resource';
import uuid from 'uuid';
import { matchPath } from 'react-router-dom';
import { CATALOGUE_ROUTES } from '@js/utils/AppRoutesUtils';
import { getFacetsByKey, getQueryParams } from '@js/api/geonode/v2/index';
import { getFacetsItems } from '@js/selectors/search';

const UPDATE_RESOURCES_REQUEST = 'GEONODE_SEARCH:UPDATE_RESOURCES_REQUEST';
const updateResourcesRequest = (payload, reset) => ({
    type: UPDATE_RESOURCES_REQUEST,
    payload,
    reset
});

const cleanParams = (params, exclude = ['d']) => {
    return Object.keys(params)
        .filter((key) => !exclude.includes(key))
        .reduce((acc, key) =>
            (!params[key] || params[key].length === 0)
                ? acc : { ...acc, [key]: isArray(params[key])
                    ? params[key].map(value => value + '')
                    : params[key] + ''
                }, {});
};

const getParams = (locationSearch = '', params, { defaultPage = 1, pagination, exclude }) => {
    const { query: locationQuery } = url.parse(locationSearch || '', true);
    const { page: qPage, ...query } = locationQuery;
    const { page, ...mergedParams } = cleanParams({
        ...params,
        ...(pagination ? locationQuery : query)
    }, exclude);
    return [
        mergedParams,
        page ? parseFloat(page) : defaultPage
    ];
};

const getNextPage = (action, state) => {
    if (!action) {
        return 1;
    }
    const currentPage = state.gnsearch?.featuredResources?.page || 1;
    const isNextPageAvailable =  state.gnsearch?.featuredResources?.isNextPageAvailable;
    if (action === 'next' && isNextPageAvailable) {
        return currentPage + 1;
    }
    const isPreviousPageAvailable = state.gnsearch?.featuredResources?.isPreviousPageAvailable;

    return isPreviousPageAvailable ? currentPage - 1 : 1;
};

export const gnsSearchResourcesEpic = (action$, store) =>
    action$.ofType(SEARCH_RESOURCES)
        .switchMap(action => {
            const { pathname = '/', params, reset } = action;
            const state = store.getState();
            const pagination = !!state?.gnsearch?.config?.pagination;
            const currentParams = cleanParams(state?.gnsearch?.params, []);
            const nextParams = cleanParams(params, []);
            const DEFAULT_QUERY_KEYS_TO_EXCLUDE_IN_COMPARISON = (pagination ? [] : ['page']);
            const nextQuery = Object.keys(nextParams).reduce((acc, key) =>
                !DEFAULT_QUERY_KEYS_TO_EXCLUDE_IN_COMPARISON.includes(key) ? { ...acc, [key]: nextParams[key] } : acc, {});
            const isSamePath = (state.router?.location?.pathname || '/') === pathname;
            const isParamsChanged = !isEqual(currentParams, nextParams);
            const previousSearch = state?.gnsearch?.locationSearch || '';
            const nextSearch = url.format({ query: nextQuery });
            if (previousSearch !== nextSearch || !isSamePath) {
                return Observable.of(push({
                    ...(pathname && !isSamePath && { pathname }),
                    search: nextSearch
                }));
            }
            if (reset || isParamsChanged) {
                return Observable.of(updateResourcesRequest({
                    action: 'PUSH',
                    params: nextParams,
                    location: state?.router?.location
                }));
            }
            return Observable.empty();
        });


const requestResourcesObservable = ({
    params,
    pageSize,
    reset,
    location
}, store) => {
    const state = store.getState();
    const customFilters = getCustomMenuFilters(state);
    const requestParams = cleanParams({ ...params, ...state?.gnsearch?.config?.defaultQuery });
    return Observable
        .defer(() => getResources({
            ...requestParams,
            pageSize,
            customFilters
        }))
        .switchMap(({
            resources,
            total,
            isNextPageAvailable
        }) => {
            const currentUser = userSelector(state);
            const preferredUsername = currentUser?.info?.preferred_username;
            const pendingExecutions = extractExecutionsFromResources(resources, preferredUsername);
            return Observable.of(
                ...pendingExecutions.map((payload) => startAsyncProcess(payload)),
                updateResources(resources, reset),
                updateResourcesMetadata({
                    isNextPageAvailable,
                    params,
                    locationSearch: location.search,
                    locationPathname: location.pathname,
                    total
                }),
                loadingResources(false)
            );
        })
        .catch(() => {
            return Observable.of(
                updateResources([], true),
                updateResourcesMetadata({
                    isNextPageAvailable: false,
                    params,
                    locationSearch: location.search,
                    locationPathname: location.pathname,
                    total: 0,
                    error: true
                }),
                loadingResources(false)
            );
        })
        .startWith(
            loadingResources(true)
        );
};

// checks if location change is made to a viewer page
const isViewerPage = (currentPath) => {
    if (currentPath === '/') return false;
    const match = CATALOGUE_ROUTES.filter(route => route.shouldNotRequestResources).some(route => {
        return route.path.some(path => matchPath(currentPath, path)?.isExact);
    });
    return match;
};

export const gnsSearchResourcesOnLocationChangeEpic = (action$, store) =>
    action$.ofType(LOCATION_CHANGE, UPDATE_RESOURCES_REQUEST)
        .filter(({ payload }) => {
            return payload.action === 'PUSH' || payload.action === 'POP';
        })
        .switchMap(action => {

            const state = store.getState();
            const pagination = !!state?.gnsearch?.config?.pagination;
            const pageSize = state?.gnsearch?.config?.pageSize;
            if (!pageSize) {
                return Observable.empty();
            }
            const { isFirstRendering, location } = action.payload || {};

            const nextParams = state.gnsearch.nextParams;

            const [previousParams, previousPage] = getParams(state.gnsearch.locationSearch, state.gnsearch.params, { pagination });
            const [currentParams, currentPage] = getParams(location.search, nextParams || {}, { pagination });

            const { pathname } = action.payload.location;

            // history action performed while navigating the browser history
            if (!nextParams || action.reset || isViewerPage(pathname)) {
                const page = pagination ? currentPage : 1;
                const params = { ...currentParams, page };
                const compareParams = pagination
                    ? isEqual({ ...previousParams, page: previousPage }, { ...currentParams, page: currentPage })
                    : isEqual(previousParams, currentParams);
                // avoid new request while browsing through history
                // if the latest saved request is equal to the new request
                // also avoid request if location change is made to a viewer page
                const shouldNotRequest = isViewerPage(pathname) || (!state?.gnsearch?.isFirstRequest && !isFirstRendering && compareParams && !action.reset);

                if (shouldNotRequest) {
                    return Observable.empty();
                }
                return requestResourcesObservable({
                    params,
                    pageSize,
                    reset: true,
                    location
                }, store);
            }

            let page;
            let resetSearch = false;
            if (pagination) {
                page = !state?.gnsearch?.isFirstRequest && !isEqual(previousParams, currentParams) ? 1 : currentPage;
                resetSearch = true;
            } else {
                const resourcesLength = state.gnsearch?.resources.length || 0;
                const loadedPages = Math.floor(resourcesLength / pageSize);
                const isNextPage = currentPage === previousPage + 1 && currentPage === loadedPages + 1;
                resetSearch = isFirstRendering || !isEqual(previousParams, currentParams) || !isNextPage;
                page = resetSearch ? 1 : currentPage;
            }
            const params = { ...currentParams, page };
            return requestResourcesObservable({
                params,
                pageSize,
                reset: resetSearch,
                location
            }, store);
        });

export const gnsRequestResourceOnLocationChange = (action$, store) =>
    action$.ofType(LOCATION_CHANGE)
        .filter(({ payload }) => {
            return payload.action === 'PUSH' || payload.action === 'POP';
        })
        .switchMap(action => {
            const state = store.getState();
            const { location } = action.payload || {};
            const { query } = url.parse(location?.search || '', true);
            const resource = getResourceData(state) || { pk: '', resource_type: '' };
            const [pk, resourceType] = (query?.d || '').split(';');
            if (`${resource?.pk}` === pk && `${resource?.resource_type}` === resourceType) {
                return Observable.empty();
            }
            return Observable.of(requestResource(pk ? pk : undefined, resourceType));
        });

export const gnsSelectResourceEpic = (action$, store) =>
    action$.ofType(REQUEST_RESOURCE)
        .switchMap(action => {
            if (isNil(action.pk)) {
                return Observable.of(setResource(null));
            }
            const state = store.getState();
            const resources = state.gnsearch?.resources || [];
            const selectedResource = resources.find(({ pk, resource_type: resourceType}) =>
                pk === action.pk && action.ctype === resourceType);
            return Observable.defer(() => getResourceByTypeAndByPk(action.ctype, action.pk))
                .switchMap((resource) => {
                    return Observable.of(setResource({
                        ...resource,
                        /* store information related to detail */
                        '@ms-detail': true
                    }));
                })
                .catch((error) => {
                    return Observable.of(resourceError(error.data || error.message));
                })
                .startWith(
                    // preload the resource if available
                    ...(selectedResource
                        ? [ setResource({
                            ...selectedResource,
                            /* store information related to detail */
                            '@ms-detail': true
                        }, true) ]
                        : [ resourceLoading() ])
                );
        });

export const getFeaturedResourcesEpic = (action$, {getState = () => {}}) =>
    action$.ofType(UPDATE_FEATURED_RESOURCES)
        .switchMap(({action, pageSize}) => {
            const page = getNextPage(action, getState());
            return Observable.defer( () => getFeaturedResources(page, pageSize))
                .switchMap((data) => {
                    return Observable.of(setFeaturedResources({...data,
                        isNextPageAvailable: !!data?.links?.next,
                        isPreviousPageAvailable: !!data?.links.previous, loading: false}));
                }).catch((error) => {
                    return Observable.of(resourceError(error.data || error.message), setFeaturedResources({loading: false}));
                }).startWith(setFeaturedResources({loading: true}));
        });

export const gnWatchStopCopyProcessOnSearch = (action$, store) =>
    action$.ofType(STOP_ASYNC_PROCESS)
        .filter(action => action?.payload?.processType === ProcessTypes.COPY_RESOURCE)
        .flatMap((action) => {
            const isError = action?.payload?.error || action?.payload?.output?.status === ProcessStatus.FAILED;
            if (isError) {
                return Observable.empty();
            }
            const newResourceUuid = action?.payload?.output?.output_params?.output?.uuid;
            if (newResourceUuid === undefined) {
                return Observable.empty();
            }
            const pk = action?.payload?.output?.input_params?.instance;
            return Observable.defer(() => getResourceByUuid(newResourceUuid))
                .switchMap((resource) => {
                    const resources = store.getState().gnsearch?.resources || [];
                    const newResources = resources.reduce((acc, res) => {
                        if (res.pk === `${pk}`) {
                            return [...acc, { ...resource, '@temporary': true, pk2: uuid() }, res]; // pk2 is added to avoid duplicate pk in resources list
                        }
                        return [...acc, res];
                    }, []);
                    return Observable.of(updateResources(newResources, true));
                });
        });

const isKeyPresent = (filterKey, filterValue) => {
    if (Array.isArray(filterValue)) {
        return filterValue.some(v => isKeyPresent(filterKey, v));
    }
    return filterKey === (typeof filterKey === "string" ? filterValue : Number(filterValue));
};

/**
 * Filter facets by expanded accordion or selected filters
 */
const filterFacets = ({facet, queryFilters, topicQuery}) => {
    if (facet?.config?.type === 'accordion') {
        const filteredValues = JSON.parse(window.localStorage.getItem('accordionsExpanded'))?.map(f => f);
        return filteredValues.includes(facet.name);
    }
    const filteredValues = queryFilters
        ?.filter(qf => castArray(topicQuery?.[facet.filter] ?? [])
            ?.map(tf => isNaN(Number(tf)) ? tf : Number(tf))
            ?.includes(qf.key ?? (isNaN(Number(qf.filterValue)) ? qf.filterValue : Number(qf.filterValue)))
        )
        ?.map(f => f.facetName);
    return !isEmpty(queryFilters) ? filteredValues?.includes(facet.name) : true;
};

/**
 * Set facet filter from topic items based on the query applied
 */
export const gnSetFacetFilter = (action$, {getState = () => {}}) =>
    action$.ofType(GET_FACET_FILTERS, LOCATION_CHANGE)
        .filter(({facets} = {}) => !isEmpty(facets) || getFacetsItems(getState()))
        .switchMap(({facets: facetsItems} = {})=> {
            const customFilters = getCustomMenuFilters(getState());
            const location = getState()?.router?.location;
            const { query } = url.parse((location?.search || ''), true);
            const stateFacetItems = getFacetsItems(getState());
            const queryFilters = Object.values(getState()?.gnsearch?.filters ?? []);

            const facets = facetsItems || stateFacetItems;
            const topicQuery = pick(query, Object.keys(query).filter(q => facets.map(f => f.filter).includes(q)));

            const facetNames = facets
                ?.filter(facet => !isEmpty(topicQuery[facet.filter]) && filterFacets({facet, topicQuery, queryFilters}))
                ?.map(facet => ({facet: facet.name, key: topicQuery[facet.filter]})) ?? [];
            const queries = {...getQueryParams(query, customFilters), include_topics: true};

            return Observable.forkJoin(
                // Get facet by key to get topic items even when count is '0'
                facetNames.map(({facet, key} = {}) => Observable.defer(() => getFacetsByKey(facet, {...queries, key})))
            ).switchMap((topics) => {
                let filters = {};
                let updatedTopics = (topics ?? [])?.reduce((a, t) => t?.items?.concat(a), []);
                if (!isEmpty(updatedTopics)) {
                    updatedTopics = uniqBy(updatedTopics, 'key');
                }
                const facetFilters = facets?.map((facet) => ({filter: facet.filter, value: query?.[facet.filter]}))?.filter(f => !isEmpty(f.value));

                facetFilters.forEach(({filter, value} = {}) => {
                    updatedTopics?.forEach((item) => {
                        const itemObj = isKeyPresent(item.key, value) && item;
                        if (!isEmpty(itemObj)) {
                            filters[filter + itemObj.key] = {...itemObj, count: itemObj.count || 0};
                        }
                    });
                });
                return Observable.of(setFilters(filters));
            }).concat(!isEmpty(stateFacetItems) ? Observable.empty() : Observable.of(setFacetItems(facets)));
        });

/**
 * Get facet filter items
 */
export const gnGetFacetItems = (action$, {getState = () => {}}) =>
    action$.ofType(GET_FACET_ITEMS)
        .switchMap(() => {
            const customFilters = getCustomMenuFilters(getState());
            return Observable.defer(() =>
                getFacetItems(customFilters)
            ).switchMap((facets = []) =>
                Observable.of(getFacetFilters(facets))
            );
        });

export default {
    gnsSearchResourcesEpic,
    gnsSearchResourcesOnLocationChangeEpic,
    gnsSelectResourceEpic,
    getFeaturedResourcesEpic,
    gnWatchStopCopyProcessOnSearch,
    gnsRequestResourceOnLocationChange,
    gnGetFacetItems,
    gnSetFacetFilter
};
