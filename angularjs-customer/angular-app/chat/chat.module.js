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
        $scope.autoScrollMessagesToBottom = function () {
            $timeout(function () {
                var messagesDiv = $window.document.getElementById('messagesDiv');
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 0, false);
        };

        $scope.pushMessage = function (message) {
            $scope.messages.push(message);
            $scope.autoScrollMessagesToBottom();
        };

        $scope.isMyMessage = function (message) {
            return AppStorage.getUserId() === message.user._id || message.user.isMe;
        };

        // send body height to the iframe host
        $timeout(function () {
            Helper.sendHeight();
        });

        // prevent scrolling overlap
        var messagesDiv = $window.document.getElementById('messagesDiv');
        messagesDiv.addEventListener('mousewheel', function (e) {
            if (messagesDiv.clientHeight + messagesDiv.scrollTop + e.deltaY >= messagesDiv.scrollHeight) {
                e.preventDefault();
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            } else if (messagesDiv.scrollTop + e.deltaY <= 0) {
                e.preventDefault();
                messagesDiv.scrollTop = 0;
            }
        }, false);

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
                    $scope.autoScrollMessagesToBottom();
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

        // Make sure message is saved
        socket.on('message saved', function (savedMessage) {
            var messageIndex = _.findIndex($scope.messages, function (message) {
                return message.content === savedMessage.content;
            });
            $scope.$apply(function () {
                $scope.messages[messageIndex] = savedMessage;
            })
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
                    isMe: true,
                    displayName: AppStorage.getUserDisplayName(),
                    site: AppStorage.getUserSite(),
                    room: AppStorage.getRoom()
                }
            };
            socket.emit('customer says', message);
            $scope.pushMessage(message);
            $scope.chatForm.content = '';
        };
    });