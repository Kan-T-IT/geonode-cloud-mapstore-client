import React, { useState, useEffect } from 'react';
import Loader from '@mapstore/framework/components/misc/Loader';

import { getFileFromDownload } from '@js/utils/FileUtils';

const PdfViewer = ({src}) => {
    const [filePath, setFilePath] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getFileFromDownload(src)
            .then((fileURL) => {
                setLoading(false);
                setFilePath(fileURL);
            }).finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (<div
            className="pdf-loader">
            <Loader size={70}/>
        </div>);
    }

    return (<iframe className="gn-pdf-viewer" type="application/pdf"
        frameBorder="0"
        scrolling="auto"
        height="100%"
        width="100%" src={filePath}/>);
};

export default PdfViewer;
