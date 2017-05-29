angular
    .module('customerChatModule', [
        'ui.router'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('customer-chat', {
                url: '/customer-chat',
                controller: 'customerChatController',
                templateUrl: './angularjs/modules/chat/customer-chat.html'
            })
    })
    .controller('customerChatController', function ($scope) {
        $scope.activeMessages = [
            {
                room: {},
                customer: {
                }
            }
        ];
    });