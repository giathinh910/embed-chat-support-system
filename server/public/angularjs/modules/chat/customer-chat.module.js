angular
    .module('customerChatModule', [
        'ui.router',
        'ngCookies'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('customer-chat', {
                url: '/customer-chat',
                params: {
                    domain: null
                },
                controller: 'customerChatController',
                templateUrl: './angularjs/modules/chat/customer-chat.html'
            })
    })
    .controller('customerChatController', function ($scope, $cookies, $http) {
        $scope.pageTitle = 'Live Chat';

        // $state.params.domain

        var socket = io('http://localhost:3001/ws/chat', {
            query: {
                token: $cookies.get('token')
            }
        });

        $scope.activeMessages = [
            {
                content: 'Hello, I\'m agent 1. How can I help you?',
                room: {},
                created_by: {
                    displayName: 'Agent 1'
                },
                created_at: ''
            },
            {
                content: 'I wanna ask ... uhm',
                room: {},
                created_by: {
                    displayName: 'Customer 1'
                },
                created_at: ''
            }
        ];
    });