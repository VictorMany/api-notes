import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import React from 'react'


export default function preview(url) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/text');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    headers.append('Access-Control-Allow-Origin', '*');

    // add the CORS headers to the response
    headers.append('Access-Control-Allow-Credentials', "true")
    headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    getLinkPreview("https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe", {
        imagesPropertyType: "og", // fetches only open-graph images
        headers: headers
    }).then(data => console.debug(data));
}

