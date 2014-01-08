/**
 * User: santi8ago8
 * GitHub: https://github.com/santi8ago8/boq.js
 */


var io = global.socketio;
var needle = require('needle');
var util = require('util');
var apiKey = "be2jzzzm5hgtv2gzp3et9zuw";
io.sockets.on('connection', function (socket) {
    socket.on('find', function (data) {
        var value = data.find;
        if (value == '' || value == null)
            value = "+";
        var urlFind = "http://content.guardianapis.com/search?q=%s&show-fields=thumbnail&page=%s&api-key=%s";
        if (data.sections.length > 0) {
            urlFind += "&section=" + data.sections.join('|');
        }

        var finalUrl = util.format(urlFind, value, data.page, apiKey);
        needle.get(finalUrl, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                socket.emit('result', body);
            }
            else {
                console.log(body, err);
                socket.emit('error', body);
            }
        });

    });
    socket.on('view', function (data) {
        var urlView = "http://content.guardianapis.com/%s?show-fields=all&api-key=%s"
        urlView = util.format(urlView, data.id, apiKey);

        needle.get(urlView, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                socket.emit('view', body.response.content);
            }
            else {
                console.log(body);
                socket.emit('error', body);
            }
        });
    })
});