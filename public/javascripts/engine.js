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
        var sections = b.u.qs('.section');
        sections.each(function (it) {
            it.addEventListener('change', function (e) {
                var isAll;
                if (e.target.id == 'all' && e.target.checked) {
                    //clean rest.
                    sections.each(function (i) {
                        i.checked = false;
                    }, 1);
                    isAll = true;
                }
                if (e.target.id != 'all' && e.target.checked)
                    b.u.qs('#all.section')[0].checked = false;
                var isAny = false;
                sections.each(function (i) {
                    if (!isAny)
                        isAny = i.checked
                });
                if (!isAny)
                    b.u.qs('#all.section')[0].checked = true;

                if (isAll) {
                    //find all news.
                }
                else {
                    //find by selected categories.
                    var cats = new b.Array();
                    sections.each(function (i) {
                        if (i.checked)
                            cats.push(i.id);
                    });
                    //TODO: en cats estan las categorías ahora hay que hacer el find :D
                }
                //if not select any, select all,
                //save in local storage.


                //always reload the news.
            });
        });
        b.u.qs('.categories')[0].addEventListener('click', function () {
            var element = b.u.qs('nav.cats')[0];
            var style = element.style.display;
            if (element.classList.contains('none'))
                element.classList.remove('none');
            else
                element.classList.add('none');
        });

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