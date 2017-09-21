/*
 * Authorization module
 * Contains services useful for the authorization
 */
angular.module('Blockstarter.authServices', ['Blockstarter.config'])

/**
 * LOCAL STORAGE easy way to use
 **/
.factory('$localStorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return $window.localStorage[key] ? JSON.parse($window.localStorage[key]) : null;
        },
        remove: function(key) {
            return $window.localStorage.removeItem(key);
        }
    }
}])

/**
 * AUTHENTICATION SERVICES using JWT + LOCALSTORAGE
 **/
.service('AuthService', function($q, $http, CONFIG, AUTH_EVENTS, $localStorage) {
    let LOCAL_TOKEN_KEY = 'BlockstarterAuth';
    var isAuthenticated = false;

    function loadUserCredentials() {
        let token = $localStorage.getObject(LOCAL_TOKEN_KEY);
        if (token)
            useCredentials(token);
    }

    function storeUserCredentials(token) {
        $localStorage.setObject(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }

    function useCredentials(token) { isAuthenticated = true; }

    function destroyUserCredentials() {
        isAuthenticated = false;
        $localStorage.remove(LOCAL_TOKEN_KEY);
    }

    function getUser() {
        return $localStorage.getObject(LOCAL_TOKEN_KEY);
    }

    var login = function(user) {
        return $q((resolve, reject) => {
            storeUserCredentials(user);
            resolve(user);
        });
    };

    let logout = () => { destroyUserCredentials(); };

    loadUserCredentials();

    return {
        getUser,
        login,
        logout,
        isAuthenticated: function() { return isAuthenticated; },
    };
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function(response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized
            }[response.status], response);
            return $q.reject(response);
        }
    };
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});