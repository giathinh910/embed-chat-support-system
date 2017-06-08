angular
    .module('chatModule', [
        'ui.router',
        'angular-jwt'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('chat', {
                url: '/chat',
                controller: 'chatController',
                templateUrl: './angular-app/chat/chat.html',
                data: {
                    requiresLogin: true
                }
            })
    })
    .controller('chatController', function ($scope, AppStorage) {
        $scope.pageTitle = 'Live Chat';

        // $state.params.domain

        var socket = io('http://localhost:3000/ws/chat/customer', {
            query: {
                token: AppStorage.getToken()
            }
        });

        $scope.activeMessages = [
            {
                content: 'Hello, I\'m agent 1. How can I help you?',
                room: {},
                createdBy: {
                    displayName: 'Agent 1'
                },
                created_at: ''
            },
            {
                content: 'I wanna ask ... uhm',
                room: {},
                createdBy: {
                    displayName: 'Customer 1'
                },
                created_at: ''
            }
        ];
    });