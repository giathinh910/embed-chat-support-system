app.service('AppStorage', function () {
    var keyPrefix = 'tbEmbedChat';

    var keyNames = {
        token: keyPrefix + 'token',
        userId: keyPrefix + 'userId',
        userEmail: keyPrefix + 'userEmail',
        userDisplayName: keyPrefix + 'userDisplayName',
        userLevel: keyPrefix + 'userLevel',
        userSite: keyPrefix + 'userSite',
        userRoom: keyPrefix + 'userRoom'
    };

    this.setToken = function (token) {
        localStorage.setItem(keyNames.token, token);
    };

    this.getToken = function () {
        return localStorage.getItem(keyNames.token);
    };

    this.setUserId = function (id) {
        localStorage.setItem(keyNames.userId, id);
    };

    this.getUserId = function () {
        return localStorage.getItem(keyNames.userId);
    };

    this.setUserEmail = function (email) {
        localStorage.setItem(keyNames.userEmail, email);
    };

    this.getUserEmail = function () {
        return localStorage.getItem(keyNames.userEmail);
    };

    this.setUserDisplayName = function (displayName) {
        localStorage.setItem(keyNames.userDisplayName, displayName);
    };

    this.getUserDisplayName = function () {
        return localStorage.getItem(keyNames.userDisplayName);
    };

    this.setUserLevel = function (level) {
        localStorage.setItem(keyNames.userLevel, level);
    };

    this.getLevel = function () {
        return localStorage.getItem(keyNames.userLevel);
    };

    this.setUserSite = function (site) {
        localStorage.setItem(keyNames.userSite, site);
    };

    this.getUserSite = function () {
        return localStorage.getItem(keyNames.userSite);
    };

    this.setUserRoom = function (room) {
        localStorage.setItem(keyNames.userRoom, room);
    };

    this.getRoom = function () {
        return localStorage.getItem(keyNames.userRoom);
    };

    this.setOnLogin = function (user) {
        this.setToken(user.token);
        this.setUserId(user._id);
        this.setUserEmail(user.email);
        this.setUserDisplayName(user.displayName);
        this.setUserLevel(user.level);
        this.setUserSite(user.site);
        this.setUserRoom(user.room);
    };

    this.reset = function () {
        localStorage.clear();
    }
});