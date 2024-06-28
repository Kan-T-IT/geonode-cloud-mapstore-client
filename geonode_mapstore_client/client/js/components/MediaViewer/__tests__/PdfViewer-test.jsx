import React from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect';
import PdfViewer from '@js/components/MediaViewer/PdfViewer';

describe('Test PdfViewer', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('should render by default', () => {
        ReactDOM.render( <PdfViewer src={"http://localhost.com"}/>, document.getElementById("container"));
        const pdfViewer = document.querySelector('.gn-pdf-viewer');
        expect(pdfViewer).toExist();
    });
});

