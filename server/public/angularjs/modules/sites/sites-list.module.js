angular
    .module('sitesListModule', [
        'ui.router',
        'ngCookies'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('sites-list', {
                url: '/list',
                controller: 'sitesListController',
                templateUrl: './angularjs/modules/sites/sites-list.html'
            })
    })
    .controller('sitesListController', function ($scope, $cookies, $http) {
        $scope.pageTitle = 'My Sites';
    });