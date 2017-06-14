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
    .controller('chatController', function ($scope, $http, AppStorage, AppConfig, $timeout, Helper, $window) {
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
                $scope.pushMessage(message);
            })
        });

        socket.on('message saved', function (message) {
            // console.log(message);
            // $scope.$apply(function() {
            //     $scope.messages.push(message);
            // })
        });

        $scope.$on('app.logout', function (e) {
            socket.close();
        });

        $scope.$on('app-content.show', function (e) {
            // wait for dom rendered
            $timeout(function () {
                // send body height to the iframe host
                Helper.sendHeight();
            });
            // scroll messages to bottom
            $scope.autoScrollMessagesToBottom();
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
            $scope.pushMessage(message);
            $scope.chatForm.content = '';
        };

        $scope.pushMessage = function (message) {
            $scope.messages.push(message);
            $scope.autoScrollMessagesToBottom();
        };

        $scope.autoScrollMessagesToBottom = function () {
            $timeout(function () {
                var messagesDiv = $window.document.getElementById('messagesDiv');
                console.log(messagesDiv);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 0, false);
        }
    });