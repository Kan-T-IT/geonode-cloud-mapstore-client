/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { forwardRef, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Menu from '@js/components/Menu';
import BurgerMenu from '@js/components/Menu/BurgerMenu';
import useResizeElement from '@js/hooks/useResizeElement';

const LeftContentMenu = ({ items, formatHref, query, variant, size, resourceName }) => {
    const navbarContentLeft = useRef();
    const navbarLeft = useRef();
    const { width: widthContentLeft } = useResizeElement(navbarContentLeft);
    const { width: widthNavbarLeft } = useResizeElement(navbarLeft);
    const [switchToBurgerMenu, setSwitchToBurgerMenu] = useState(false);
    useEffect(() => {
        setSwitchToBurgerMenu(widthNavbarLeft >= widthContentLeft);
    }, [widthNavbarLeft, widthContentLeft]);

    return (
        <div
            className={`gn-menu-content-side gn-menu-content-left`}
            ref={navbarContentLeft}
        >
            {switchToBurgerMenu && items && (
                <BurgerMenu items={items} variant={variant} />
            )}

            {!switchToBurgerMenu && items && (
                <Menu
                    ref={navbarLeft}
                    items={items}
                    containerClass={`gn-menu-list`}
                    formatHref={formatHref}
                    query={query}
                    variant={variant}
                    size={size}
                    resourceName={resourceName}
                />
            )}
        </div>
    );
};

const RightContentMenu = ({ items, formatHref, query, variant, size }) => {
    const navbarRight = useRef();

    return (
        <div className={`gn-menu-content-right`}>
            {items && (
                <Menu
                    ref={navbarRight}
                    items={items}
                    containerClass={`gn-menu-list`}
                    formatHref={formatHref}
                    query={query}
                    variant={variant}
                    alignRight
                    size={size}
                />
            )}
        </div>
    );
};

const ActionNavbar = forwardRef(
    (
        {
            style,
            leftItems,
            rightItems,
            query,
            formatHref,
            variant,
            size,
            resource
        },
        ref
    ) => {
        return (
            <nav ref={ref} className={`gn-menu gn-${variant}`} style={style}>
                <div className="gn-menu-container">
                    <div className="gn-menu-content">
                        {leftItems.length > 0 && (
                            <LeftContentMenu
                                items={leftItems}
                                formatHref={formatHref}
                                query={query}
                                variant={variant}
                                size={size}
                                resourceName={resource?.title}
                            />
                        )}
                        {rightItems.length > 0 && (
                            <RightContentMenu
                                items={rightItems}
                                formatHref={formatHref}
                                query={query}
                                variant={variant}
                                size={size}
                            />
                        )}
                    </div>
                </div>
            </nav>
        );
    }
);

ActionNavbar.propTypes = {
    style: PropTypes.object,
    leftItems: PropTypes.array,
    rightItems: PropTypes.array,
    query: PropTypes.object,
    formatHref: PropTypes.func,
    variant: PropTypes.string
};

ActionNavbar.defaultProps = {
    leftItems: [],
    rightItems: [],
    query: {},
    formatHref: () => '#',
    variant: 'primary'
};

export default ActionNavbar;
