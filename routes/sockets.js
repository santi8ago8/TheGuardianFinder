/**
 * User: santi8ago8
 * GitHub: https://github.com/santi8ago8/boq.js
 */


var io = global.socketio;
var needle = require('needle');
var util = require('util');
io.sockets.on('connection', function (socket) {
    socket.on('find', function (data) {
        var value = data.find;
        var url = "http://content.guardianapis.com/search?q=%s&show-fields=thumbnail&api-key=%s";
        var apiKey = "be2jzzzm5hgtv2gzp3et9zuw";
        var finalUrl = util.format(url, value, apiKey);
        needle.get(finalUrl, function (err, resp, body) {
            console.log('done find!');
            if (!err && resp.statusCode == 200) {
                socket.emit('result', body);
            }
            else {
                console.log(body);
                socket.emit('error', body);
            }
        });

    });
});