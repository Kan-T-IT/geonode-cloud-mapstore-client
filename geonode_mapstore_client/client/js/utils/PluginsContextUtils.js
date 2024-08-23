/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    getMetadataUrl,
    getMetadataDetailUrl,
    resourceHasPermission,
    canCopyResource,
    isDocumentExternalSource,
    getCataloguePath
} from '@js/utils/ResourceUtils';
import get from 'lodash/get';

function getUserResourceName(user) {
    return user?.first_name !== '' && user?.last_name !== ''
        ? `${user?.first_name} ${user?.last_name}`
        : user?.username;
}

function getUserResourceNames(users = []) {
    if (!users) {
        return [];
    }

    const userArray = !Array.isArray(users) ? [users] : users;
    return userArray.map((user) => {
        return {
            href: '/messages/create/' + user.pk,
            value: getUserResourceName(user)
        };
    });
}

export const getPluginsContext = () => ({
    get,
    getMetadataUrl,
    getMetadataDetailUrl,
    resourceHasPermission,
    canCopyResource,
    userHasPermission: (user, perm) => user?.perms?.includes(perm),
    getUserResourceName,
    getUserResourceNames,
    isDocumentExternalSource,
    getCataloguePath
});
