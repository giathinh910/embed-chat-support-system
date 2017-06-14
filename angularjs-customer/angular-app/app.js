var app = angular
    .module('appModule', [
        'ui.router',
        'angular-jwt',
        'loginModule',
        'registerModule',
        'chatModule'
    ])
    .config(function ($stateProvider, $httpProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './angular-app/app.html'
                // redirectTo: '/chat'
            });
        $httpProvider.interceptors.push('HttpInterceptor');
    })
    .run(function ($state, $transitions, jwtHelper, AppStorage, Helper, $window, AppConfig) {
        // get site id from query params
        var query = Helper.queryParser($window.location.search);
        if (AppConfig.site) {
            $state.go('chat');
        } else {
            if (query.site) {
                AppConfig.setUserSite(query.site);
                $state.go('chat');
            } else {
                $state.go('home');
                return;
            }
        }

        // middleware
        $transitions.onStart({}, function (trans) {
            var nextStateName = trans.to().name;
            var nextStateData = trans.to().data;

            if (nextStateData && nextStateData.requiresLogin) {
                if (AppStorage.getToken()) {
                    if (jwtHelper.isTokenExpired(AppStorage.getToken()))
                        $state.go('login');
                    else
                        $state.go(nextStateName);
                } else
                    $state.go('login');
            } else {
                if (AppStorage.getToken()) {
                    if (jwtHelper.isTokenExpired(AppStorage.getToken()))
                        $state.go(nextStateName);
                    else
                        $state.go('chat');
                } else
                    $state.go(nextStateName);
            }
        });
    })
    .controller('appController', function ($scope, AppStorage, Helper, $state, $timeout, jwtHelper) {
        // send body height to the iframe host
        $timeout(function () {
            Helper.sendHeight();
        });

        // control main content visibility
        $scope.appContentToggleState = false;

        // handle app header click action
        $scope.toggleAppContent = function () {
            $scope.appContentToggleState = !$scope.appContentToggleState;
            $timeout(function () {
                Helper.sendHeight();
                $scope.$broadcast('app-content.show');
            });
        };

        // return authentication state
        $scope.loggedIn = function () {
            return AppStorage.getToken() && !jwtHelper.isTokenExpired(AppStorage.getToken())
        };

        $scope.logout = function ($event) {
            AppStorage.reset();
            $scope.$broadcast('app.logout');
            $state.go('login');
            $event.preventDefault();
            $event.stopPropagation();
        }
    });

