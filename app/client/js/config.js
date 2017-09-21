/*
 * Configuration module
 * Contains constants and url abbreviations
 *
 * NOTES: remember geoNear index for mongo
 */
angular.module("Blockstarter.config", [])
    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant("CONFIG", {
        "appVersion": "1.5.0",
        "base_url": "http://localhost:8080",
        "endpoint": "/api/v1",
        "login": "/authenticate",
        "register": "/signup",
        "projects": "/projects",
        "backer": "/projects/backer",
        "creator": "/projects/creator",
    });