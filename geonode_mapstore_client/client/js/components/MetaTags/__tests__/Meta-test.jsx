import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import expect from 'expect';
import Meta from '../Meta';


describe('MetaTags', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('should render by default', () => {
        render(<Meta
            logo={'http://example.com'}
            title={"Test Title"}
            siteName={"Test Site"}
            content={"Test Content"}
        />, document.getElementById("container"));

        const metaTags = document.querySelectorAll("meta");
        expect(metaTags).toExist();
        metaTags.forEach(tag => {
            if (tag.property === "og:site_name") {
                expect(tag.content).toEqual("Test Site");
            }

            if (tag.property === "title") {
                expect(tag.content).toEqual("Test Title");
            }

            if (tag.name === "decription" || tag.name === "twitter:description") {
                expect(tag.content).toEqual("Test Content");
            }

            if (tag.name === "twitter:image:src") {
                expect(tag.content).toEqual("http://example.com");
            }
        });
    });
});
