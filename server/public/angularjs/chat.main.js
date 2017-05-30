angular
    .module('chatMainModule', [
        'ui.router',
        'ngCookies',
        'customerChatModule'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                redirectTo: '/customer-chat'
            });
    })
    .run(function ($state) {
        $state.go('customer-chat');
    })
    .controller('chatMainController', function ($http) {
        $http({
            method: 'GET',
            url: '//localhost:3001/api/auth/me'
        }).then(function (res) {
            console.log(res.data);
        });
    });