/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Observable } from 'rxjs';
import axios from '@mapstore/framework/libs/ajax';
import uuid from "uuid";
import url from "url";
import { getNewMapConfiguration, getNewGeoStoryConfig } from '@js/api/geonode/config';
import {
    getDatasetByPk,
    getGeoAppByPk,
    getDocumentByPk,
    getMapByPk,
    getCompactPermissionsByPk,
    setResourceThumbnail
} from '@js/api/geonode/v2';
import { configureMap } from '@mapstore/framework/actions/config';
import { mapSelector } from '@mapstore/framework/selectors/map';
import { isMapInfoOpen } from '@mapstore/framework/selectors/mapInfo';
import { getSelectedLayer } from '@mapstore/framework/selectors/layers';
import { isLoggedIn } from '@mapstore/framework/selectors/security';
import {
    browseData,
    selectNode
} from '@mapstore/framework/actions/layers';
import {
    updateStatus,
    initStyleService
} from '@mapstore/framework/actions/styleeditor';
import {
    setNewResource,
    setResourceType,
    setResourceId,
    setResource,
    REQUEST_NEW_RESOURCE_CONFIG,
    REQUEST_RESOURCE_CONFIG,
    resetResourceState,
    loadingResourceConfig,
    resourceConfigError,
    setResourceCompactPermissions,
    updateResourceProperties,
    SET_RESOURCE_THUMBNAIL,
    updateResource
} from '@js/actions/gnresource';

import {
    setCurrentStory,
    setResource as setGeoStoryResource,
    setEditing
} from '@mapstore/framework/actions/geostory';
import {
    dashboardLoaded,
    dashboardLoading,
    resetDashboard
} from '@mapstore/framework/actions/dashboard';

import {
    setControlProperty,
    resetControls,
    SET_CONTROL_PROPERTY,
    setControlProperties
} from '@mapstore/framework/actions/controls';
import {
    resourceToLayerConfig,
    ResourceTypes,
    toMapStoreMapConfig,
    parseStyleName,
    getCataloguePath
} from '@js/utils/ResourceUtils';
import {
    canAddResource,
    getResourceData,
    getResourceThumbnail
} from '@js/selectors/resource';
import { updateAdditionalLayer } from '@mapstore/framework/actions/additionallayers';
import { STYLE_OWNER_NAME } from '@mapstore/framework/utils/StyleEditorUtils';
import { styleServiceSelector } from '@mapstore/framework/selectors/styleeditor';
import { updateStyleService } from '@mapstore/framework/api/StyleEditor';
import { CLICK_ON_MAP, resizeMap } from '@mapstore/framework/actions/map';
import { purgeMapInfoResults, closeIdentify } from '@mapstore/framework/actions/mapInfo';
import { saveError } from '@js/actions/gnsave';
import {
    error as errorNotification,
    success as successNotification,
    warning as warningNotification
} from '@mapstore/framework/actions/notifications';
import { getStyleProperties } from '@js/api/geonode/style';
import { convertDependenciesMappingForCompatibility } from '@mapstore/framework/utils/WidgetsUtils';

const resourceTypes = {
    [ResourceTypes.DATASET]: {
        resourceObservable: (pk, options) => {
            const { page, selectedLayer, map: currentMap } = options || {};
            return Observable.defer(() =>
                axios.all([
                    getNewMapConfiguration(),
                    options?.isSamePreviousResource
                        ? new Promise(resolve => resolve(options.resourceData))
                        : getDatasetByPk(pk)
                ])
                    .then((response) => {
                        const [mapConfig, gnLayer] = response;
                        const newLayer = resourceToLayerConfig(gnLayer);

                        if (!newLayer?.extendedParams?.defaultStyle || page !== 'dataset_edit_style_viewer') {
                            return [mapConfig, gnLayer, newLayer];
                        }

                        return getStyleProperties({
                            baseUrl: options?.styleService?.baseUrl,
                            styleName: parseStyleName(newLayer.extendedParams.defaultStyle)
                        }).then((updatedStyle) => {
                            return [
                                mapConfig,
                                gnLayer,
                                {
                                    ...newLayer,
                                    availableStyles: [{
                                        ...updatedStyle,
                                        ...newLayer.extendedParams.defaultStyle
                                    }]
                                }
                            ];
                        });
                    })
            )
                .switchMap((response) => {
                    const [mapConfig, gnLayer, newLayer] = response;
                    const {minx, miny, maxx, maxy } = newLayer?.bbox?.bounds || {};
                    const extent = newLayer?.bbox?.bounds && [minx, miny, maxx, maxy ];
                    return Observable.of(
                        configureMap({
                            ...mapConfig,
                            map: {
                                ...mapConfig.map,
                                ...currentMap, // keep configuration for other pages when resource id is the same (eg: center, zoom)
                                layers: [
                                    ...mapConfig.map.layers,
                                    {
                                        ...selectedLayer, // keep configuration for other pages when resource id is the same (eg: filters)
                                        ...newLayer,
                                        isDataset: true,
                                        _v_: Date.now()
                                    }
                                ]
                            }
                        }),
                        ...((extent && !currentMap)
                            ? [ setControlProperty('fitBounds', 'geometry', extent) ]
                            : []),
                        setControlProperty('toolbar', 'expanded', false),
                        setControlProperty('rightOverlay', 'enabled', 'DetailViewer'),
                        selectNode(newLayer.id, 'layer', false),
                        setResource(gnLayer),
                        setResourceId(pk),
                        ...(page === 'dataset_edit_data_viewer'
                            ? [
                                browseData(newLayer)
                            ]
                            : []),
                        ...(page === 'dataset_edit_style_viewer'
                            ? [
                                setControlProperty('visualStyleEditor', 'enabled', true),
                                updateAdditionalLayer(newLayer.id, STYLE_OWNER_NAME, 'override', {}),
                                updateStatus('edit'),
                                resizeMap()
                            ]
                            : []),
                        ...(newLayer?.bboxError
                            ? [warningNotification({ title: "gnviewer.invalidBbox", message: "gnviewer.invalidBboxMsg" })]
                            : [])
                    );
                });
        }
    },
    [ResourceTypes.MAP]: {
        resourceObservable: (pk, options) =>
            Observable.defer(() =>  axios.all([
                getNewMapConfiguration(),
                getMapByPk(pk)
            ]))
                .switchMap(([baseConfig, resource]) => {
                    const mapConfig = options.data
                        ? options.data
                        : toMapStoreMapConfig(resource, baseConfig);
                    return Observable.of(
                        configureMap(mapConfig),
                        setControlProperty('toolbar', 'expanded', false),
                        setResource(resource),
                        setResourceId(pk)
                    );
                }),
        newResourceObservable: (options) =>
            Observable.defer(() => axios.all([
                getNewMapConfiguration(),
                ...(options?.query?.['gn-dataset']
                    ? [ getDatasetByPk(options.query['gn-dataset']) ]
                    : [])
            ]))
                .switchMap(([ response, gnLayer ]) => {
                    const mapConfig = options.data || response;
                    const newLayer = gnLayer ? resourceToLayerConfig(gnLayer) : null;
                    const { minx, miny, maxx, maxy } = newLayer?.bbox?.bounds || {};
                    const extent = newLayer?.bbox?.bounds && [ minx, miny, maxx, maxy ];
                    return Observable.of(
                        configureMap(newLayer
                            ? {
                                ...mapConfig,
                                map: {
                                    ...mapConfig?.map,
                                    layers: [
                                        ...(mapConfig?.map?.layers || []),
                                        newLayer
                                    ]
                                }
                            }
                            : mapConfig),
                        ...(extent
                            // Add duration to allow map config to be properly updated with zoom on fitBounds action
                            ? [ setControlProperties('fitBounds', 'geometry', extent, "duration", 400) ]
                            : []),
                        setControlProperty('toolbar', 'expanded', false)
                    );
                })
    },
    [ResourceTypes.GEOSTORY]: {
        resourceObservable: (pk, options) =>
            Observable.defer(() => getGeoAppByPk(pk))
                .switchMap((resource) => {
                    return Observable.of(
                        setCurrentStory(options.data || resource.data),
                        setResource(resource),
                        setResourceId(pk),
                        setGeoStoryResource({
                            canEdit: resource?.perms?.includes('change_resourcebase')
                        })
                    );
                }),
        newResourceObservable: (options) =>
            Observable.defer(() => getNewGeoStoryConfig())
                .switchMap((gnGeoStory) => {
                    return Observable.of(
                        setCurrentStory(options.data || {...gnGeoStory, sections: [{...gnGeoStory.sections[0], id: uuid(),
                            contents: [{...gnGeoStory.sections[0].contents[0], id: uuid()}]}]}),
                        setEditing(true),
                        setGeoStoryResource({
                            canEdit: true
                        })
                    );
                })
    },
    [ResourceTypes.DOCUMENT]: {
        resourceObservable: (pk) =>
            Observable.defer(() => getDocumentByPk(pk))
                .switchMap((gnDocument) => {
                    return Observable.of(
                        setControlProperty('rightOverlay', 'enabled', 'DetailViewer'),
                        setResource(gnDocument),
                        setResourceId(pk)
                    );
                })
    },
    [ResourceTypes.DASHBOARD]: {
        resourceObservable: (pk, options) =>
            Observable.defer(() => getGeoAppByPk(pk))
                .switchMap(( resource ) => {
                    const { readOnly } = options || {};
                    const canEdit = !readOnly && resource?.perms?.includes('change_resourcebase') ? true : false;
                    const canDelete = !readOnly && resource?.perms?.includes('delete_resourcebase') ? true : false;
                    return Observable.of(
                        dashboardLoaded(
                            {
                                canDelete,
                                canEdit,
                                creation: resource.created,
                                description: resource.abstract,
                                id: pk,
                                lastUpdate: resource.last_updated,
                                name: resource.title
                            },
                            options.data ? convertDependenciesMappingForCompatibility(options.data) : convertDependenciesMappingForCompatibility(resource.data)
                        ),
                        setResource(resource),
                        setResourceId(pk)
                    );
                })
                .startWith(dashboardLoading(false)),
        newResourceObservable: (options) =>
            Observable.of(
                resetDashboard(),
                ...(options.data ? [
                    dashboardLoaded(
                        {
                            canDelete: true,
                            canEdit: true
                        },
                        convertDependenciesMappingForCompatibility(options.data)
                    )
                ] : []),
                dashboardLoading(false)
            )
    }
};

// collect all the reset action needed before changing a viewer
const getResetActions = (isSameResource) => [
    resetControls(),
    ...(!isSameResource ? [ resetResourceState() ] : []),
    setControlProperty('rightOverlay', 'enabled', false),
    setControlProperty('fitBounds', 'geometry', null)
];

export const gnViewerRequestNewResourceConfig = (action$, store) =>
    action$.ofType(REQUEST_NEW_RESOURCE_CONFIG)
        .switchMap((action) => {
            const { newResourceObservable } = resourceTypes[action.resourceType] || {};
            const state = store.getState();
            if (!canAddResource(state)) {
                const formattedUrl = url.format({
                    ...window.location,
                    pathname: '/account/login/',
                    hash: '',
                    search: `?next=${getCataloguePath('/catalogue')}`
                });
                window.location.href = formattedUrl;
                window.reload();
                return Observable.empty();
            }

            const { query = {} } = url.parse(state?.router?.location?.search, true) || {};

            if (!newResourceObservable) {
                return Observable.of(
                    ...getResetActions(),
                    loadingResourceConfig(false)
                );
            }

            return Observable.concat(
                Observable.of(
                    ...getResetActions(),
                    loadingResourceConfig(true),
                    setNewResource(),
                    setResourceType(action.resourceType)
                ),
                newResourceObservable({ query }),
                Observable.of(
                    setControlProperty('pendingChanges', 'value', null),
                    loadingResourceConfig(false)
                )
            )
                .catch((error) => {
                    return Observable.of(
                        ...getResetActions(),
                        resourceConfigError(error?.data?.detail || error?.statusText || error?.message)
                    );
                });
        });

export const gnViewerRequestResourceConfig = (action$, store) =>
    action$.ofType(REQUEST_RESOURCE_CONFIG)
        .switchMap((action) => {

            const state = store.getState();

            const currentPendingChanges = state?.controls?.pendingChanges?.value;
            const pendingChanges = currentPendingChanges
                && currentPendingChanges.pk === action.pk
                && currentPendingChanges.resourceType === action.resourceType
                ? currentPendingChanges
                : {};

            const { resourceObservable } = resourceTypes[action.resourceType] || {};

            if (!resourceObservable) {
                return Observable.of(
                    ...getResetActions(),
                    loadingResourceConfig(false)
                );
            }
            const styleService = styleServiceSelector(state);
            const resourceData = getResourceData(state);
            const isSamePreviousResource = !resourceData?.['@ms-detail'] && resourceData?.pk === action.pk;
            return Observable.concat(
                Observable.of(
                    ...getResetActions(isSamePreviousResource),
                    loadingResourceConfig(true),
                    setResourceType(action.resourceType)
                ),
                ...((!isSamePreviousResource && !!isLoggedIn(state))
                    ? [
                        Observable.defer(() => getCompactPermissionsByPk(action.pk))
                            .switchMap((compactPermissions) => {
                                return Observable.of(setResourceCompactPermissions(compactPermissions));
                            })
                            .catch(() => {
                                return Observable.empty();
                            })
                    ]
                    : []),
                ...(styleService?.baseUrl
                    ? [Observable.defer(() => updateStyleService({
                        styleService
                    }))
                        .switchMap((updatedStyleService) => {
                            return Observable.of(initStyleService(updatedStyleService));
                        })]
                    : []),
                resourceObservable(action.pk, {
                    ...action.options,
                    // set the pending changes as the new data fro maps, dashboards and geostories
                    // if undefined the returned data will be used
                    data: pendingChanges?.data,
                    styleService: styleServiceSelector(state),
                    isSamePreviousResource,
                    resourceData,
                    selectedLayer: isSamePreviousResource && getSelectedLayer(state),
                    map: isSamePreviousResource && mapSelector(state)
                }),
                Observable.of(
                    ...(pendingChanges?.resource ? [updateResourceProperties(pendingChanges.resource)] : []),
                    setControlProperty('pendingChanges', 'value', null),
                    loadingResourceConfig(false)
                )
            )
                .catch((error) => {
                    return Observable.of(
                        ...getResetActions(),
                        resourceConfigError(error?.data?.detail || error?.statusText || error?.message)
                    );
                });
        });

export const gnViewerSetNewResourceThumbnail = (action$, store) =>
    action$.ofType(SET_RESOURCE_THUMBNAIL)
        .switchMap(() => {
            const state = store.getState();
            const newThumbnailData = getResourceThumbnail(state);
            const resourceIDThumbnail = state?.gnresource?.id;
            const currentResource = state.gnresource?.data || {};

            const body = {
                file: newThumbnailData
            };

            return Observable.defer(() => setResourceThumbnail(resourceIDThumbnail, body))
                .switchMap((res) => {
                    return Observable.of(updateResourceProperties({ ...currentResource, thumbnail_url: res.thumbnail_url, thumbnailChanged: false, updatingThumbnail: false }), updateResource({ ...currentResource, thumbnail_url: res.thumbnail_url }),
                        successNotification({ title: "gnviewer.thumbnailsaved", message: "gnviewer.thumbnailsaved" }));
                }).catch((error) => {
                    return Observable.of(
                        saveError(error.data || error.message),
                        errorNotification({ title: "map.mapError.errorTitle", message: "map.mapError.errorDefault" })
                    );
                });
        });

export const closeInfoPanelOnMapClick = (action$, store) => action$.ofType(CLICK_ON_MAP)
    .filter(() => store.getState().controls?.rightOverlay?.enabled === 'DetailViewer' || store.getState().controls?.rightOverlay?.enabled === 'Share')
    .switchMap(() => Observable.of(setControlProperty('rightOverlay', 'enabled', false)));


// Check which control is enabled between annotations and datasetsCatlog
const oneOfTheOther = (control) => {
    if (control === 'rightOverlay') return null;
    return {
        control,
        alternate: control === 'annotations' ? 'datasetsCatalog' : 'annotations'
    };
};

/**
 * Close open panels on new panel open
 */
export const closeOpenPanels = (action$, store) => action$.ofType(SET_CONTROL_PROPERTY)
    .filter((action) => !!action.value)
    .switchMap((action) => {
        const state = store.getState();
        const getActions = () => {
            const setActions = [];
            if (isMapInfoOpen(state)) {
                setActions.push(purgeMapInfoResults(), closeIdentify());
            }
            const control = oneOfTheOther(action.control);
            if (control?.control) {
                if (state.controls?.rightOverlay?.enabled === 'DetailViewer' || state.controls?.rightOverlay?.enabled === 'Share') {
                    setActions.push(setControlProperty('rightOverlay', 'enabled', false));
                } else if (!!state.controls?.[`${control.alternate}`]?.enabled) {
                    setActions.push(setControlProperty(`${control.alternate}`, 'enabled', false));
                }
            }
            return setActions;
        };
        const actions = getActions();
        return actions.length > 0 ? Observable.of(...actions) : Observable.empty();
    });

export default {
    gnViewerRequestNewResourceConfig,
    gnViewerRequestResourceConfig,
    gnViewerSetNewResourceThumbnail,
    closeInfoPanelOnMapClick,
    closeOpenPanels
};
