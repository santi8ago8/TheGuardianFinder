/**
 * User: santi8ago8
 * https://github.com/santi8ago8/TheGuardianFinder
 */
(function (window) {
    var socket = io.connect();
    var template;
    var templateNot;
    var totalPages = 1;
    var currentPage = 1;
    var value;
    var cats = new b.Array();
    var storageCats = window.localStorage.getItem('cats');
    if (storageCats) {
        cats = new b.Array(JSON.parse(storageCats));
    }
    window.initEngine = function () {
        var input = b.u.qs('#find').f();
        input.addEventListener('keyup', find);
        template = b.u.qs('#tmplResults').f();
        template = jade.compile(template.text || template.innerText || template.innerHTML);
        templateNot = b.u.qs('#tmlpView').f();
        templateNot = jade.compile(templateNot.text || templateNot.innerText || templateNot.innerHTML);
        if (cats.length == 0) {
            b.u.qs('#all.section').f().checked = true;
        }
        var sections = b.u.qs('.section');
        sections.each(function (it) {
            if (cats.indexOf(it.id) != -1) {
                it.checked = true;
            }
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
                    b.u.qs('#all.section').f().checked = false;
                var isAny = false;
                sections.each(function (i) {
                    if (!isAny)
                        isAny = i.checked
                });
                if (!isAny)
                    b.u.qs('#all.section').f().checked = true;
                cats = new b.Array();
                if (!isAll) {
                    //finding selected categories.
                    sections.each(function (i) {
                        if (i.checked)
                            cats.push(i.id);
                    });
                }
                window.localStorage.setItem('cats', JSON.stringify(cats));

                //always reload the news.
                currentPage = 1;
                totalPages = 1;

            });
        });
        b.u.qs('.categories').f().addEventListener('click', function () {
            var element = b.u.qs('nav.cats').f();
            if (element.classList.contains('none'))
                element.classList.remove('none');
            else {
                element.classList.add('none');
                b.Router.goTo('/');
            }
        });
        //

        b.Router.on("/", {
            cb: renderIndex,
            container: '.content.result.find-result',
            exit: function () {
                b.u.qs('#next').f().classList.add('none');
                totalPages = 1;
                currentPage = 1;
            }
        });
        b.Router.on("/news/:idnot", {
            cb: renderNot,
            container: '.content.result.find-result',
            exit: function () {
                socket.removeListener('view', viewNot);
            }
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
        var content = b.u.qs('.content.result.find-result').f();
        b.u.qs('#next').f().classList.remove('none');
        if (content.classList.contains('loading')) {
            content.innerHTML = '';
            content.classList.remove('loading');
        }
        var div = document.createElement('div');
        div.innerHTML = template(data);
        var childrens = new b.Array(div.children);
        while (childrens.length > 0) {
            content.appendChild(childrens.f());
        }
        totalPages = data.response.pages;
        currentPage = data.response.currentPage;
    };
    var showError = function (dataError) {
        console.log("Error: ", dataError);
    };

    var renderIndex = function (config) {

        loadingNews();

        var next = b.u.qs('#next').f();
        next.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage <= totalPages) {
                currentPage++;
                socket.emit('find', {find: value, page: currentPage, sections: cats });
            }
        });
        socket.emit('find', {find: value, page: currentPage, sections: cats});
    };
    var loadingNews = function () {
        var l = b.u.qs('.content.result.find-result').f();
        l.innerHTML = '<div class="loader"></div>'
        l.classList.add('loading');
    };

    var viewNot;
    var renderNot = function (config) {

        loadingNews();

        config.params.idnot = decodeURIComponent(config.params.idnot);
        viewNot = function (data) {
            //data.fields.lastModified = moment(data.fields.lastModified).fromNow();
            config.container.f().innerHTML = templateNot({not: data, moment: moment});
            var iFrame = config.container.f().querySelector('iframe');
            if (iFrame)
                iFrame.remove();
        };
        socket.on('view', viewNot);

        socket.emit('view', {id: config.params.idnot});
    };
    socket.on('error', showError);
    socket.on('result', showResults);
}(window));