app.service('AppStorage', function() {
    var keyNames = {
        token: 'token',
        userEmail: 'userEmail',
        userDisplayName: 'userDisplayName'
    };

    this.setToken = function(token) {
        localStorage.setItem(keyNames.token, token);
    };

    this.getToken = function() {
        return localStorage.getItem(keyNames.token);
    };

    this.setUserEmail = function(email) {
        localStorage.setItem(keyNames.userEmail, email);
    };

    this.getUserEmail = function() {
        return localStorage.getItem(keyNames.userEmail);
    };

    this.setDisplayName = function(displayName) {
        localStorage.setItem(keyNames.userDisplayName, displayName);
    };

    this.getDisplayName = function() {
        return localStorage.getItem(keyNames.userDisplayName);
    };

    this.setOnLogin = function(user) {
        this.setToken(user.token);
        this.setUserEmail(user.email);
        this.setDisplayName(user.displayName);
    };

    this.reset = function() {
        localStorage.clear();
    }
});