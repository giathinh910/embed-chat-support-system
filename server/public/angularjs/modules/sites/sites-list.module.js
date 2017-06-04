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
        $scope.pageTitle = 'My Websites';

        $scope.sites = [];

        $http({
            method: 'GET',
            url: '//localhost:3001/api/sites?page=1'
        }).then(function (res) {
            $scope.sites = res.data;
        }, function errorCallback(res) {
            console.log(res.error);
        });

        $scope.startChat = function() {

        }
    });