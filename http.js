function decoded_target_url(r) {
    var url = decodeURIComponent(r.args.url);
    var httpsUrl = url.replace(/^http:/, 'https:');
    return httpsUrl;
}

export default {decoded_target_url};

