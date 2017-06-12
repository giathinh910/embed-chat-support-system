app.service('Helper', function () {
    this.queryParser = function (queryString) {
        var paramsObj = {};

        if (queryString.charAt(0) === '?')
            queryString = queryString.replace('?', '');

        var params = queryString.split('&');

        params.forEach(function (param) {
            var splittedParam = param.split(('='));
            paramsObj[splittedParam[0]] = splittedParam[1];
        });

        return paramsObj;
    };
});