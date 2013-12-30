/*
 * GET home page.
 */
var needle = require('needle');
var util = require('util');
exports.index = function (req, res) {
    var init = function () {
        res.render('index', { sections: cachedSections });
    };
    if (cachedSections.length == 0)
        setTimeout(init, 250);
    else init();
};
var cachedSections = [];

var url = "http://content.guardianapis.com/sections?api-key=%s";
var apiKey = "be2jzzzm5hgtv2gzp3et9zuw";
var finalUrl = util.format(url, apiKey);
needle.get(finalUrl, function (err, resp, body) {
    if (!err && resp.statusCode == 200) {
        cachedSections = [];
        cachedSections.push({id: 'all', webTitle: 'All sections'});
        body.response.results.sort(function (a, b) {
            if (a.webTitle <= b.webTitle) {
                if (a.webTitle == b.webTitle)
                    return 0;
                else
                    return -1;
            }
            else
                return 1;
        });
        for (var i = 0; i < body.response.results.length; i++) {
            var o = body.response.results[i];
            cachedSections.push(o);
        }

    }
    else {
        console.log(body);
        socket.emit('error', body);
    }
});