/**
 * User: santi8ago8
 * https://github.com/santi8ago8/TheGuardianFinder
 */
(function (window) {
    var socket = io.connect();
    var template;
    var totalPages = 1;
    var currentPage = 1;
    var value;
    window.initEngine = function () {
        var input = document.querySelector('#find');
        input.addEventListener('keyup', find);
        template = document.querySelector('#tmplResults');
        template = jade.compile(template.text || template.innerText || template.innerHTML);
        var next = document.querySelector('#next');
        next.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage <= totalPages) {
                currentPage++;
                socket.emit('find', {find: value, page: currentPage});
            }
        });
        socket.emit('find', {find: value, page: currentPage});
    };

    var find = function (e) {
        var code = e.keyCode || e.which;
        var input = document.querySelector('#find');

        if (code == 13 && input.value != null && input.value != '') {
            totalPages = 1;
            currentPage = 1;
            value = input.value;
            var findingTxt = document.querySelector('#finding');
            findingTxt.innerText = "Finding: " + value;
            socket.emit('find', {find: value, page: currentPage});
            var content = document.querySelector('.content.result.find-result');
            content.innerHTML = "";
        }
    };

    var showResults = function (data) {
        var content = document.querySelector('.content.result.find-result');
        var div = document.createElement('div');
        div.innerHTML = template(data);
        var childrens = new b.Array(div.children);
        while (childrens.length > 0) {
            content.appendChild(childrens[0]);
        }
        totalPages = data.response.pages;
        currentPage = data.response.currentPage;
    };
    var showError = function (dataError) {
        console.log("Error: ", dataError);
    };
    socket.on('error', showError);
    socket.on('result', showResults);
}(window));