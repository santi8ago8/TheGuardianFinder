/**
 * User: santi8ago8
 * GitHub: https://github.com/santi8ago8/boq.js
 */

var socket = io.connect();
var template;
var initEngine = function () {
    var input = document.querySelector('#find');
    input.addEventListener('keyup', find);
    template = document.querySelector('#tmplResults');
    template = jade.compile(template.text || template.innerText || template.innerHTML);

};

var find = function (e) {
    var code = e.keyCode || e.which;
    var input = document.querySelector('#find');

    if (code == 13 && input.value != null && input.value != '') {
        var value = input.value;
        var findingTxt = document.querySelector('#finding');
        findingTxt.innerText = "Finding: " + value;
        socket.emit('find', {find: value});
    }
};

var showResults = function (data) {
    var content = document.querySelector('.content.result.find-result');
    content.innerHTML = template(data);
};
var showError = function (dataError) {
    console.log("Error: ", dataError);
};
socket.on('error', showError);
socket.on('result', showResults);
