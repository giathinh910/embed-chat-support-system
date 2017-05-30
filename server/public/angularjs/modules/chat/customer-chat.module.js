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
    .controller('customerChatController', function ($scope, $http) {
        $scope.activeMessages = [
            {
                content: 'Hello, I\'m agent 1. How can I help you?',
                room: {},
                created_by: {
                    display_name: 'Agent 1'
                },
                created_at: ''
            },
            {
                content: 'I wanna ask ... uhm',
                room: {},
                created_by: {
                    display_name: 'Customer 1'
                },
                created_at: ''
            }
        ];
    });