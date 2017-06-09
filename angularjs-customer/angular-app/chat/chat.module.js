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
        $scope.chatForm = {
            content: ''
        };

        $scope.messages = [
            // {
            //     content: '',
            //     createdBy: {
            //         displayName: ''
            //     }
            // }
        ];

        // $state.params.domain

        var socket = io('http://localhost:3000/ws/chat', {
            query: {
                token: AppStorage.getToken()
            }
        });

        $scope.sendMessage = function () {
            var message = {
                content: $scope.chatForm.content,
                createdBy: {
                    displayName: AppStorage.getDisplayName(),
                    site: AppStorage.getSite(),
                    room: AppStorage.getRoom()
                }
            };
            socket.emit('customer says', message);
            $scope.messages.push(message);
            console.log(message);
            $scope.chatForm.content = '';
        };
    });