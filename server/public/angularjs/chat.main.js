angular
    .module('chatMainModule', [
        'ui.router',
        'customerChatModule'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                redirectTo: '/customer-chat'
            })
    })
    .run(function ($state) {
        $state.go('customer-chat');
    })
    .controller('chatMainController', function ($scope, $state) {
    });