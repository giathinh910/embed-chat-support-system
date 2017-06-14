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

    this.setId = function (id) {
        localStorage.setItem(keyNames.userId, id);
    };

    this.getId = function () {
        return localStorage.getItem(keyNames.userId);
    };

    this.setEmail = function (email) {
        localStorage.setItem(keyNames.userEmail, email);
    };

    this.getEmail = function () {
        return localStorage.getItem(keyNames.userEmail);
    };

    this.setDisplayName = function (displayName) {
        localStorage.setItem(keyNames.userDisplayName, displayName);
    };

    this.getDisplayName = function () {
        return localStorage.getItem(keyNames.userDisplayName);
    };

    this.setLevel = function (level) {
        localStorage.setItem(keyNames.userLevel, level);
    };

    this.getLevel = function () {
        return localStorage.getItem(keyNames.userLevel);
    };

    this.setSite = function (site) {
        localStorage.setItem(keyNames.userSite, site);
    };

    this.getSite = function () {
        return localStorage.getItem(keyNames.userSite);
    };

    this.setRoom = function (room) {
        localStorage.setItem(keyNames.userRoom, room);
    };

    this.getRoom = function () {
        return localStorage.getItem(keyNames.userRoom);
    };

    this.setOnLogin = function (user) {
        this.setToken(user.token);
        this.setEmail(user._id);
        this.setEmail(user.email);
        this.setDisplayName(user.displayName);
        this.setLevel(user.level);
        this.setSite(user.site);
        this.setRoom(user.room);
    };

    this.reset = function () {
        localStorage.clear();
    }
});