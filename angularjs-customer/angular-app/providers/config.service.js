app.service('AppConfig', function () {
    this.apiUrl = 'http://localhost:3000/api/customer';
    this.site = null;

    this.setUserSite = function (siteId) {
        this.site = siteId;
    }
});