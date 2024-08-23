/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    setConfigProp,
    getConfigProp,
    setLocalConfigurationFile
} from '@mapstore/framework/utils/ConfigUtils';
import {
    getSupportedLocales,
    setSupportedLocales
} from '@mapstore/framework/utils/LocaleUtils';
import { getState } from '@mapstore/framework/utils/StateUtils';
import { generateActionTrigger } from '@mapstore/framework/epics/jsapi';
import { LOCATION_CHANGE } from 'connected-react-router';
import { setRegGeoserverRule } from '@mapstore/framework/utils/LayersUtils';
import { mapSelector } from '@mapstore/framework/selectors/map';

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

import url from 'url';
import axios from '@mapstore/framework/libs/ajax';
import moment from 'moment';
import { addLocaleData } from 'react-intl';
import { setViewer } from '@mapstore/framework/utils/MapInfoUtils';

// we need this configuration set for specific components that use recompose/rxjs streams
import { setObservableConfig } from 'recompose';
import rxjsConfig from 'recompose/rxjsObservableConfig';
import { getGeoNodeConfig, getGeoNodeLocalConfig } from "@js/utils/APIUtils";
setObservableConfig(rxjsConfig);

let actionListeners = {};
// Target url here to fix proxy issue
let targetURL = '';
const getTargetUrl = () => {
    if (!__DEVTOOLS__) {
        return '';
    }
    if (targetURL) {
        return targetURL;
    }
    const geonodeUrl = getConfigProp('geoNodeSettings')?.geonodeUrl || '';
    if (!geonodeUrl) {
        return '';
    }
    const { host, protocol } = url.parse(geonodeUrl);
    targetURL = `${protocol}//${host}`;
    return targetURL;
};

export function getVersion() {
    if (!__DEVTOOLS__) {
        return __MAPSTORE_PROJECT_CONFIG__.version;
    }
    return 'dev';
}

export function initializeApp() {

    // Set X-CSRFToken in axios;
    axios.defaults.xsrfHeaderName = "X-CSRFToken";
    axios.defaults.xsrfCookieName = "csrftoken";

    setLocalConfigurationFile('');
    setRegGeoserverRule(/\/[\w- ]*geoserver[\w- ]*\/|\/[\w- ]*gs[\w- ]*\//);
    const pathsNeedVersion = [
        'static/mapstore/',
        'print.json'
    ];
    axios.interceptors.request.use(
        config => {
            if (config.url && pathsNeedVersion.filter(pathNeedVersion => config.url.match(pathNeedVersion))[0]) {
                return {
                    ...config,
                    params: {
                        ...config.params,
                        v: getVersion()
                    }
                };
            }
            const tUrl = getTargetUrl();
            if (tUrl && config.url?.match(tUrl)?.[0]) {
                return {
                    ...config,
                    url: config.url.replace(tUrl, '')
                };
            }
            return config;
        }
    );
    // Set proxy and authentication from geonode config
    ['proxyUrl', 'useAuthenticationRules', 'authenticationRules'].forEach(key=> {
        setConfigProp(key, getGeoNodeLocalConfig(key));
    });
}

export function getPluginsConfiguration(pluginsConfig, key) {
    if (isArray(pluginsConfig)) {
        return pluginsConfig;
    }
    if (isObject(pluginsConfig)) {
        const pluginsConfigSection = pluginsConfig[key];
        if (pluginsConfigSection) {
            // use string to link duplicated configurations
            return isString(pluginsConfigSection)
                ? pluginsConfig[pluginsConfigSection]
                : pluginsConfigSection;
        }
        return pluginsConfig;
    }
    return [];
}

function getLanguageKey(languageCode) {
    const parts = languageCode.split('-');
    return parts[0];
}

function parseLanguageCode(languageCode) {
    const parts = languageCode.split('-');
    if (parts.length === 1) {
        return parts[0].toLowerCase();
    }
    return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
}

function languagesToSupportedLocales(languages) {
    if (!languages || languages.length === 0) {
        return null;
    }
    return languages.reduce((acc, [code, description]) => ({
        ...acc,
        [getLanguageKey(code)]: {
            code: parseLanguageCode(code),
            description
        }
    }), {});
}

function setupLocale(locale) {
    return import(`react-intl/locale-data/${locale}`)
        .then((localeDataMod) => {
            const localeData = localeDataMod.default;
            addLocaleData([...localeData]);
            if (!global.Intl) {
                return import('intl')
                    .then((intlMod) => {
                        global.Intl = intlMod.default;
                        return import(`intl/locale-data/jsonp/${locale}.js`).then(() => {
                            return locale;
                        });
                    });
            }
            // setup locale for moment
            moment.locale(locale);
            return locale;
        });
}

let apiPluginsConfig;

export function setupConfiguration({
    localConfig,
    user,
    resourcesTotalCount
}) {
    const { query } = url.parse(window.location.href, true);
    // set the extensions path before get the localConfig
    // so it's possible to override in a custom project
    setConfigProp('extensionsRegistry', '/static/mapstore/extensions/index.json');
    const {
        supportedLocales: defaultSupportedLocales,
        ...config
    } = localConfig;
    const geoNodePageConfig = getGeoNodeConfig();
    Object.keys(config).forEach((key) => {
        setConfigProp(key, config[key]);
    });
    setConfigProp('translationsPath', geoNodePageConfig.translationsPath
        ? geoNodePageConfig.translationsPath
        : config.translationsPath
            ? config.translationsPath
            : ['/static/mapstore/ms-translations', '/static/mapstore/gn-translations']
    );
    const supportedLocales = languagesToSupportedLocales(geoNodePageConfig.languages) || defaultSupportedLocales || getSupportedLocales();
    setSupportedLocales(supportedLocales);
    const locale = supportedLocales[getLanguageKey(geoNodePageConfig.languageCode)]?.code || 'en-US';
    setConfigProp('locale', locale);
    const geoNodeResourcesInfo = getConfigProp('geoNodeResourcesInfo') || {};
    setConfigProp('geoNodeResourcesInfo', { ...geoNodeResourcesInfo, ...resourcesTotalCount });
    const securityState = user?.info?.access_token
        ? {
            security: {
                user: user,
                token: user.info.access_token
            }
        }
        : undefined;

    // globlal window interface to interact with the django page
    const actionTrigger = generateActionTrigger(LOCATION_CHANGE);
    // similar implementation of MapStore2 API without the create part
    /**
     * @global
     * @property {function} getMapState return the map state if available
     * @property {function} triggerAction dispatch an action
     * @property {function} onAction add listener to an action
     * @property {function} offAction remove listener to an action
     * @example
     * <!--
     * access to mapstore api
     * -->
     * <script>
     *  window.addEventListener('mapstore:ready', function(event) {
     *      const msAPI = event.detail;
     *  });
     * </script>
     *
     * @example
     * <!--
     * use mapstore api onAction method to listen to an action
     * this example works only in a page with the map plugin (eg. dataset and map viewers)
     * -->
     * <script>
     *  window.addEventListener('mapstore:ready', function(event) {
     *      const msAPI = event.detail;
     *      function onChangeMapView(action) {
     *          // read parameters dispatched by the action
     *          const center = action.center;
     *          console.log(center);
     *          // get all the current stored map state
     *          const currentMapState = msAPI.getMapState();
     *          console.log(currentMapState);
     *      }
     *      // listen on map view changes
     *      msAPI.onAction('CHANGE_MAP_VIEW', onChangeMapView);
     *  });
     * </script>
     *
     * @example
     * <!--
     * use mapstore api offAction method to listen to an action only once
     * this example works only in a page with the map plugin (eg. dataset and map viewers)
     * -->
     * <script>
     *  window.addEventListener('mapstore:ready', function(event) {
     *      const msAPI = event.detail;
     *      function onChangeMapView(action) {
     *          // read parameters dispatched by the action
     *          const center = action.center;
     *          console.log(center);
     *          // ...
     *          // remove the same action
     *          msAPI.offAction('CHANGE_MAP_VIEW', onChangeMapView);
     *      }
     *      // listen on map view changes
     *      msAPI.onAction('CHANGE_MAP_VIEW', onChangeMapView);
     *  });
     * </script>
     *
     * @example
     * <!--
     * use mapstore api triggerAction method to dispatch an action
     * this example works only in a page with the map plugin (eg. dataset and map viewers)
     * -->
     * <button id="custom-zoom-button">Zoom to extent</button>
     * <script>
     *  window.addEventListener('mapstore:ready', function(event) {
     *      const msAPI = event.detail;
     *      const button = document.querySelector('#custom-zoom-button');
     *      button.addEventListener('click', function() {
     *          msAPI.triggerAction({
     *              type: 'ZOOM_TO_EXTENT',
     *              crs: 'EPSG:4326',
     *              extent: {
     *                  minx: -10,
     *                  miny: -10,
     *                  maxx: 10,
     *                  maxy: 10
     *              }
     *          });
     *      });
     *  });
     * </script>
     */
    window.MapStoreAPI = {
        ready: true,
        getMapState: function() {
            return mapSelector(getState());
        },
        triggerAction: actionTrigger.trigger,
        onAction: (type, listener) => {
            const listeners = actionListeners[type] || [];
            listeners.push(listener);
            actionListeners[type] = listeners;
        },
        offAction: (type, listener) => {
            const listeners = (actionListeners[type] || [])
                .filter((l) => l !== listener);
            actionListeners[type] = listeners;
        },
        setGetFeatureInfoViewer: setViewer,
        setPluginsConfig: (pluginsConfig) => { apiPluginsConfig = pluginsConfig; }
    };
    const mapstoreReady = new CustomEvent('mapstore:ready', {
        detail: window.MapStoreAPI
    });
    window.dispatchEvent(mapstoreReady);
    if (window.onInitMapStoreAPI) {
        window.onInitMapStoreAPI(window.MapStoreAPI, geoNodePageConfig);
    }

    return setupLocale(getLanguageKey(geoNodePageConfig.languageCode))
        .then(() => ({
            query,
            securityState,
            geoNodeConfiguration: localConfig.geoNodeConfiguration,
            geoNodePageConfig,
            pluginsConfigKey: query.config || geoNodePageConfig.pluginsConfigKey,
            mapType: geoNodePageConfig.mapType,
            settings: localConfig.geoNodeSettings,
            MapStoreAPI: window.MapStoreAPI,
            onStoreInit: (store) => {
                store.addActionListener((action) => {
                    const act = action.type === 'PERFORM_ACTION' && action.action || action; // Needed to works also in debug
                    (actionListeners[act.type] || [])
                        .concat(actionListeners['*'] || [])
                        .forEach((listener) => {
                            listener.call(null, act);
                        });
                });
            },
            configEpics: {
                gnMapStoreApiEpic: actionTrigger.epic
            }
        }));
}

export const getPluginsConfigOverride = (pluginsConfig) => isFunction(apiPluginsConfig)
    ? apiPluginsConfig(pluginsConfig)
    : isObject(apiPluginsConfig)
        ? apiPluginsConfig
        : pluginsConfig;
