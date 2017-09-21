angular.module("Blockstarter", ['ngRoute', 'ngSanitize', 'mgcrea.ngStrap', 'Blockstarter.config', 'Blockstarter.controllers', 'Blockstarter.api', 'Blockstarter.authServices'])
    .run(function($rootScope, $window) {
        console.info("Blockstarter 4.0 Project");

        // handling navbar in different controllers (to hide or show the header navbar)
        $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {

            if (current.$$route.controller === "RegisterCtrl" || current.$$route.controller === "LoginCtrl") {
                $rootScope.navbar = false;
                $rootScope.footerbar = false;
            } else {
                $rootScope.navbar = true;
                $rootScope.footerbar = true;
            }
        });

        // event handler fired when the transition begins
        $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
            if (!AuthService.isAuthenticated()) {
                event.preventDefault();
                window.location.href = "/#/login";
            }
        });
    })

.config(function($routeProvider, $httpProvider) {

    $routeProvider
        .when('/projects/view', {
            templateUrl: 'templates/projects.html',
            controller: 'ProjectsCtrl'
        })
        .when('/projects/view/:project', {
            templateUrl: 'templates/projectview.html',
            controller: 'ProjectCtrl'
        })
        .when('/projects/add', {
            templateUrl: 'templates/add-project.html',
            controller: 'ProjectsCtrl'
        })
        .when('/creator/:creator', {
            templateUrl: 'templates/projects.html',
            controller: 'CreatorsCtrl'
        })
        .when('/backer/:backer', {
            templateUrl: 'templates/projects.html',
            controller: 'BackersCtrl'
        })
        .when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: '/projects/view'
        });

    $httpProvider.interceptors.push('AuthInterceptor');
})

.service('projectService', function() {
    let project = '';

    let addProject = function(proj) {
        project = proj;
    };

    let getProject = function() {
        return project;
    };

    return {
        addProject,
        getProject
    };

});;