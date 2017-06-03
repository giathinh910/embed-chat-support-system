angular
    .module('sitesAddModule', [
        'ui.router',
        'ngCookies'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('sites-add', {
                url: '/add',
                controller: 'sitesAddController',
                templateUrl: './angularjs/modules/sites/sites-add.html'
            })
    })
    .controller('sitesAddController', function ($scope, $cookies, $http, $state) {
        $scope.pageTitle = 'Add new site';

        $scope.alert = '';

        $scope.form = {
            domain: '',
            displayName: ''
        };

        $scope.submit = function () {
            $http({
                method: 'POST',
                url: '//localhost:3001/api/sites',
                data: $scope.form
            }).then(function (res) {
                if (res.data.error) {
                    switch (res.data.error) {
                        case 'SiteExisted':
                            $scope.alert = 'This domain name has already existed'
                            break;
                    }
                } else
                    $state.go('sites-list');
            });
        }
    });