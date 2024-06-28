import React from 'react';
import { Helmet } from 'react-helmet';

export const MetaTags = ({siteName, title, content, logo, contentURL =  window.location.href}) => {
    return (<Helmet>
        <title>{title}</title>
        <meta name="description" content={content} />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:url" content={contentURL} />
        <meta property="og:description" content={content} />
        <meta property="og:image" content={logo} />

        <meta name="twitter:site" content={siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={content} />
        <meta name="twitter:image:src" content={logo}/>
    </Helmet>);
};

MetaTags.defaultProps = {
    content: "Sharing geospatial data and maps",
    siteName: "Geonode",
    logo: ""
};
export default MetaTags;
