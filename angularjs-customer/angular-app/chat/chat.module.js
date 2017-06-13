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
    .controller('chatController', function ($scope, $http, AppStorage, AppConfig, $timeout, Helper) {
        $timeout(function () {
            Helper.sendHeight();
        });

        $scope.chatForm = {
            content: ''
        };

        $scope.messages = [
            // {
            //     content: '',
            //     user: {
            //         displayName: ''
            //     }
            // }
        ];

        $http({
            method: 'GET',
            url: AppConfig.apiUrl + '/messages/room/' + AppStorage.getRoom()
            // params: {
            // }
        }).then(
            function (res) {
                if (res.data.error)
                    alert(res.data.error);
                else {
                    $scope.messages = res.data;
                }
            },
            function errorCallback(res) {
                console.log(res);
            }
        );

        var socket = io('http://localhost:3000/ws/chat', {
            query: {
                token: AppStorage.getToken()
            }
        });

        socket.on('agent says', function (message) {
            $scope.$apply(function () {
                $scope.messages.push(message);
            })
        });

        socket.on('message saved', function (message) {
            console.log(message);
            // $scope.$apply(function() {
            //     $scope.messages.push(message);
            // })
        });

        $scope.sendMessage = function () {
            var message = {
                content: $scope.chatForm.content,
                user: {
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