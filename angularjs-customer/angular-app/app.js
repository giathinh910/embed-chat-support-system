var app = angular
    .module('appModule', [
        'ui.router',
        'angular-jwt',
        'loginModule',
        'registerModule',
        'chatModule'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                redirectTo: '/chat'
            });
    })
    .run(function ($state, $transitions, jwtHelper, AppStorage) {
        $state.go('chat');

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
    .controller('appController', function ($http) {
        // $http({
        //     method: 'GET',
        //     url: '//localhost:3000/api/customer/auth/me'
        // }).then(function (res) {
        //     console.log(res.data);
        // });
    });