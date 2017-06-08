angular
    .module('loginModule', [
        'ui.router',
        'angular-jwt'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'loginController',
                templateUrl: './angular-app/auth/login.html',
                data: {
                    requiresLogin: false
                }
            })
    })
    .controller('loginController', function ($scope, $http, $state, AppStorage, AppConfig) {
        $scope.loginForm = {
            email: 'customer1@email.com',
            password: '121212',
            site: '5939217ece8ba60020dfafd7'
        };

        $scope.login = function () {
            $http({
                method: 'POST',
                url: AppConfig.apiUrl + '/auth/login',
                data: $scope.loginForm
            }).then(
                function (res) {
                    if (res.data.error)
                        alert(res.data.error);
                    else {
                        AppStorage.setOnLogin(res.data);
                        $state.go('chat');
                    }
                },
                function errorCallback(res) {
                    console.log(res.error);
                }
            );
        }
    });
