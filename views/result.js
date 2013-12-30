
-for (var i=0;i<response.results.length;i++)
    - var not = response.results[i];
    article.notice
        a(href=not.webUrl)
            img(src=not.fields.thumbnail)
            p= not.webTitle
            .clear
        .clear
