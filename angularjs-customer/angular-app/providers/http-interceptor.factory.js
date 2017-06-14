app.factory('HttpInterceptor', function (AppStorage) {
    return {
        request: function (config) {
            config.headers['Authorization'] = 'Bearer ' + AppStorage.getToken();
            return config;
        }
    };
});