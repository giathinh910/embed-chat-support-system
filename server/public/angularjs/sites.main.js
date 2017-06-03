angular
    .module('sitesMainModule', [
        'ui.router',
        'ngCookies',
        'sitesListModule',
        'sitesAddModule'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('sites', {
                url: '/',
                redirectTo: '/sites-list'
            });
    })
    .run(function ($state, $http, $cookies) {
        $state.go('sites-list');
        if ($cookies.get('token'))
            $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('token');
    })
    .controller('sitesMainController', function ($http) {
        $http({
            method: 'GET',
            url: '//localhost:3001/api/auth/me'
        }).then(function (res) {
            console.log('I am' , res.data);
        });
    });