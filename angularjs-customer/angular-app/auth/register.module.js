angular
    .module('registerModule', [
        'ui.router',
        'angular-jwt'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('register', {
                url: '/register',
                controller: 'registerController',
                templateUrl: './angular-app/auth/register.html',
                data: {
                    requiresLogin: false
                }
            })
    })
    .controller('registerController', function ($scope, $http, $state, AppConfig, $timeout, Helper) {
        $timeout(function() {
            Helper.sendHeight();
        });

        $scope.registerForm = {
            email: 'customer1@email.com',
            displayName: 'Customer 1',
            password: '121212',
            site: AppConfig.site
        };

        $scope.register = function () {
            $http({
                method: 'POST',
                url: AppConfig.apiUrl + '/auth/register',
                data: $scope.registerForm
            }).then(
                function (res) {
                    if (res.data.error)
                        alert(res.data.error);
                    else {
                        $state.go('login');
                    }
                },
                function errorCallback(res) {
                    console.log(res.error);
                }
            );
        };
    });