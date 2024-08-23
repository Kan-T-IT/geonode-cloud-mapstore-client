/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useRef, useState, useEffect } from 'react';
import { Glyphicon } from 'react-bootstrap';
import FaIcon from '@js/components/FaIcon';
import Button from '@js/components/Button';
import DetailsInfo from './DetailsInfo';
import Spinner from '@js/components/Spinner';
import Message from '@mapstore/framework/components/I18N/Message';
import tooltip from '@mapstore/framework/components/misc/enhancers/tooltip';
import moment from 'moment';
import { getResourceTypesInfo, getMetadataDetailUrl } from '@js/utils/ResourceUtils';
import debounce from 'lodash/debounce';
import CopyToClipboardCmp from 'react-copy-to-clipboard';
import ResourceStatus from '@js/components/ResourceStatus';
import AuthorInfo from '@js/components/AuthorInfo/AuthorInfo';
import { getUserName } from '@js/utils/SearchUtils';
import { useInView } from 'react-intersection-observer';
import DetailsResourcePreview from './DetailsResourcePreview';
import DetailsThumbnail from './DetailsThumbnail';

const CopyToClipboard = tooltip(CopyToClipboardCmp);

const EditTitle = ({ title, onEdit, disabled }) => {
    const [textValue, setTextValue] = React.useState(title);
    return (
        <div className="gn-details-text">
            <input
                className="gn-details-text-input"
                onChange={(evt) => {
                    setTextValue(evt.target.value);
                    onEdit(evt.target.value);
                }}
                value={textValue}
                disabled={disabled}
            />
        </div>);
};

function formatResourceLinkUrl(resource) {
    if (resource?.uuid) {
        return window.location.href.replace(/#.+$/, `uuid/${resource.uuid}`);
    }
    return window.location.href;
}

const ResourceMessage = ({ type, pathname, formatHref }) => {
    return (
        <span className="gn-details-panel-origin">
            <Message msgId="gnviewer.resourceOrigin.a" />{' '}
            <a
                href={formatHref({
                    pathname,
                    query: {
                        'f': type
                    }
                })}
            >
                {type || 'resource'}
            </a>
            {' '}<Message msgId="gnviewer.resourceOrigin.from" />{' '}
        </span>
    );
};


const DetailsPanelTools = ({
    resource,
    enableFavorite,
    favorite,
    onFavorite,
    detailUrl,
    editThumbnail,
    resourceCanPreviewed,
    canView,
    metadataDetailUrl,
    name,
    toolbarItems = []
}) => {

    const isMounted = useRef();
    const [copiedUrl, setCopiedUrl] = useState({
        resource: false,
        datasetowsurl: false
    });

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleCopyPermalink = (type) => {
        setCopiedUrl({...copiedUrl, [type]: true});
        setTimeout(() => {
            if (isMounted.current) {
                setCopiedUrl({...copiedUrl, [type]: false});
            }
        }, 700);
    };

    const handleFavorite = (fav) => {
        onFavorite(!fav);
    };

    return (
        <div className="gn-details-panel-tools">
            <ResourceStatus resource={resource} />
            {enableFavorite &&
            <Button
                variant="default"
                onClick={debounce(() => handleFavorite(favorite), 500)}>
                <FaIcon name={favorite ? 'star' : 'star-o'} />
            </Button>}
            {toolbarItems.map(({ Component, name: toolbarItemName }, index) => {
                return (<Component key={toolbarItemName || index} showIcon />);
            })}
            <CopyToClipboard
                tooltipPosition="top"
                tooltipId={
                    copiedUrl.resource
                        ? 'gnhome.copiedResourceUrl'
                        : 'gnhome.copyResourceUrl'
                }
                text={formatResourceLinkUrl(resource)}
            >
                <Button
                    variant="default"
                    onClick={()=> handleCopyPermalink('resource')}>
                    <FaIcon name="share-alt" />
                </Button>
            </CopyToClipboard>
            {resource?.dataset_ows_url && <CopyToClipboard
                tooltipPosition="top"
                tooltipId={
                    copiedUrl.capabilities
                        ? 'gnhome.copiedDatasetOwsUrl'
                        : 'gnhome.copyDatasetOwsUrl'
                }
                text={resource.dataset_ows_url}
            >
                <Button
                    variant="default"
                    onClick={()=> handleCopyPermalink('datasetowsurl')}>
                    <FaIcon name="globe" />
                </Button>
            </CopyToClipboard>}
            {detailUrl && !editThumbnail && <Button
                variant="primary"
                href={(resourceCanPreviewed || canView) ? detailUrl : metadataDetailUrl}
                rel="noopener noreferrer">
                <Message msgId={`gnhome.view${((resourceCanPreviewed) ? name : 'Metadata')}`} />
            </Button>}
        </div>
    );
};

function DetailsPanel({
    resource,
    formatHref,
    linkHref,
    sectionStyle,
    loading,
    downloading,
    getTypesInfo,
    editTitle,
    editThumbnail,
    activeEditMode,
    closePanel,
    favorite,
    onFavorite,
    enableFavorite,
    onMapThumbnail,
    savingThumbnailMap,
    layers,
    isThumbnailChanged,
    onResourceThumbnail,
    resourceThumbnailUpdating,
    initialBbox,
    enableMapViewer,
    onClose,
    tabs,
    pathname,
    toolbarItems,
    onSetExtent
}) {
    const detailsContainerNode = useRef();
    const [titleNodeRef, titleInView] = useInView();
    if (!resource && !loading) {
        return null;
    }

    const types = getTypesInfo();
    const {
        formatDetailUrl = res => res?.detail_url,
        canPreviewed,
        hasPermission,
        icon,
        name
    } = resource && (types[resource.subtype] || types[resource.resource_type]) || {};
    const detailUrl = resource?.pk && formatDetailUrl(resource);
    const resourceCanPreviewed = resource?.pk && canPreviewed && canPreviewed(resource);
    const canView = resource?.pk && hasPermission && hasPermission(resource);
    const metadataDetailUrl = resource?.pk && getMetadataDetailUrl(resource);
    const tools = (
        <DetailsPanelTools
            name={name}
            resource={resource}
            enableFavorite={enableFavorite}
            favorite={favorite}
            onFavorite={onFavorite}
            detailUrl={detailUrl}
            editThumbnail={editThumbnail}
            resourceCanPreviewed={resourceCanPreviewed}
            canView={canView}
            metadataDetailUrl={metadataDetailUrl}
            toolbarItems={toolbarItems}
        />
    );
    return (
        <div
            ref={detailsContainerNode}
            className={`gn-details-panel${loading ? ' loading' : ''}`}
            style={{ width: sectionStyle?.width }}
        >
            <section style={sectionStyle}>
                <div className="gn-details-panel-header">
                    {(!titleInView && resource?.title) ? <FaIcon name={icon} /> : null}
                    <div className="gn-details-panel-header-title">
                        {(!titleInView && resource?.title) ? resource.title : null}
                    </div>
                    {(!titleInView && resource?.title) ? tools : null}
                    <Button
                        variant="default"
                        href={linkHref ? linkHref() : undefined}
                        onClick={closePanel}
                        className="square-button">
                        <Glyphicon glyph="1-close" />
                    </Button>
                </div>
                <DetailsResourcePreview
                    resource={resource}
                    getTypesInfo={getTypesInfo}
                    loading={loading}
                    enabled={!!(resourceCanPreviewed && !activeEditMode && !editThumbnail)}
                />
                <div className="gn-details-panel-content">
                    <DetailsThumbnail
                        enabled={!!editThumbnail}
                        resource={resource}
                        activeEditMode={activeEditMode}
                        enableMapViewer={enableMapViewer}
                        onResourceThumbnail={onResourceThumbnail}
                        editThumbnail={editThumbnail}
                        resourceThumbnailUpdating={resourceThumbnailUpdating}
                        isThumbnailChanged={isThumbnailChanged}
                        layers={layers}
                        onMapThumbnail={onMapThumbnail}
                        onClose={onClose}
                        savingThumbnailMap={savingThumbnailMap}
                        initialBbox={initialBbox}
                        icon={icon}
                    />
                    <div className="gn-details-panel-content-text">
                        <div ref={titleNodeRef} className="gn-details-panel-title" >
                            <span className="gn-details-panel-title-icon" >{!downloading ? <FaIcon name={icon} /> : <Spinner />} </span> <EditTitle disabled={!activeEditMode}  title={resource?.title} onEdit={editTitle} >
                            </EditTitle>
                            {tools}
                        </div>
                        {<p className="gn-details-panel-meta-text">
                            {resource?.owner &&  <>{resource?.owner.avatar &&
                            <img src={resource?.owner.avatar} alt={getUserName(resource?.owner)} className="gn-card-author-image" />
                            }
                            <ResourceMessage type={resource?.resource_type} pathname={pathname} formatHref={formatHref} />
                            <AuthorInfo resource={resource} formatHref={formatHref} pathname={pathname} style={{ margin: 0 }} detailsPanel /></>}
                            {(resource?.date_type && resource?.date)
                            && <>{' '}/{' '}{moment(resource.date).format('MMMM Do YYYY')}</>}
                        </p>
                        }
                        {resource?.abstract
                            ? <div className="gn-details-text">
                                <span className="gn-details-text-body" dangerouslySetInnerHTML={{ __html: resource.abstract }} />
                            </div>
                            : null}
                    </div>
                </div>
                <DetailsInfo tabs={tabs} formatHref={formatHref} allowEdit={activeEditMode} resourceTypesInfo={types} resource={resource} onSetExtent={onSetExtent}/>
            </section>
        </div>
    );
}

DetailsPanel.defaultProps = {
    onClose: () => { },
    formatHref: () => '#',
    linkHref: () => '#',
    onResourceThumbnail: () => '#',
    width: 696,
    getTypesInfo: getResourceTypesInfo,
    isThumbnailChanged: false
};

export default DetailsPanel;
