angular.module("Blockstarter.controllers", [])

.controller('AppCtrl', function($scope, Api, $rootScope, $http, CONFIG, $window, AuthService) {

    console.log("Application Ctrl");

    let logout = () => {
        AuthService.logout();
        $window.location.href = "/#/login";
    }

    if (!AuthService.isAuthenticated()) {
        logout();
    }

    $scope.logout = logout;

    if (AuthService.getUser()) {
        $scope.address = AuthService.getUser().address;
    }
})

.controller('ProjectsCtrl', function($scope, Api, $window, $rootScope, AuthService, projectService) {
    console.log("Projects Ctrl");
    // scope variables
    const user = AuthService.getUser();
    $scope.projectList = [];
    $scope.loaded = false;
    console.log(user);

    // get all the projects
    Api
        .getAllProjects()
        .then(response => {
            console.log(response);
            $scope.loaded = true;
            $scope.projectList = response;
        })
        .catch(error => console.log(error));

    // open a selected project
    $scope.openProject = (project) => {
        projectService.addProject(project);
        $window.location.href = `/#/projects/view/${project.address}`;
    }

    // create the project
    $scope.createProject = (project, token) => {
        project.creator = token.creator = user.address;
        let request = { project, token };
        console.log(request);
        if (project.duration < 1) {
            project.duration = 1;
        }

        Api
            .addProject(request)
            .then(response => {
                console.log(response);
                $window.location.href = '/#/projects'
            })
            .catch(error => console.log(error));
    }

})

.controller('ProjectCtrl', function($scope, Api, $window, $rootScope, $routeParams, AuthService, projectService) {
    console.log("Single Project Ctrl");
    const user = AuthService.getUser();

    // set scope variables
    $scope.user = user;
    $scope.alertSucc = false;
    $scope.alertErr = false;
    $scope.project = projectService.getProject();
    console.log($scope.project);
    console.log(user);

    // if not provided by another controller, get project data from api
    if (!$scope.project) {
        Api
            .getProject($routeParams.project)
            .then(response => {
                console.log(response);
                $scope.project = response;
            })
            .catch(error => console.log(error));
    }

    // fund the project
    $scope.fundProject = (project, amount) => {
        const req = {
            project,
            amount,
            backer: user.address
        }
        console.log(req);
        Api
            .backProject(req)
            .then(response => {
                console.log(response);
                $scope.project.fundingStatus = parseFloat($scope.project.fundingStatus) + parseFloat(amount);
                $scope.project.finalFundings = parseFloat($scope.project.finalFundings) + parseFloat(amount);
                $scope.project.goalReached = response.goalReached;
            })
            .catch(error => console.error(error));
    }

    // withdraw from the project
    $scope.withdrawProject = (project, amount) => {
        const req = {
            project,
            amount,
            creator: user.address
        };
        console.log(req);
        if (amount && amount > 0) {
            Api
                .withdrawProject(req)
                .then(response => {
                    console.log('Withdraw', response);
                    $scope.project.fundingStatus = parseFloat($scope.project.fundingStatus) - parseFloat(amount);

                })
                .catch(error => console.error(error));
        } else {
            console.log("The amount must be a valid number");
        }

    }

    // claim shares
    $scope.showShares = (token) => {
        const req = {
            token,
            backer: user.address
        }

        Api
            .showShares(req)
            .then(response => {
                console.log('Show Shares', response);
                if (Object.keys(response).length !== 0) {
                    $scope.message = `Your Shares: ${response.shares}, total supply: ${response.totalSupply}`;
                    $scope.alertSucc = true;
                } else {
                    $scope.alertErr = true;
                }
            })
            .catch(error => console.error(errors));
    }

    $scope.close = () => {
        $scope.alertSucc = false;
        $scope.alertErr = false;
    };

    // claim shares
    $scope.claimShares = (project, token) => {
        const req = {
            token,
            project,
            backer: user.address
        }

        Api
            .claimShares(req)
            .then(response => {
                console.log('Claim Shares', response);
                if (Object.keys(response).length !== 0) {
                    $scope.message = `You successfully claimed ${response.value} ${response.symbol}, ${(response.value/response.initialSupply*100).toFixed(2)}% of the project`;
                    $scope.alertSucc = true;
                } else {
                    $scope.alertErr = true;
                }
            })
            .catch(error => console.error(errors));
    }

})

.controller('CreatorsCtrl', function($scope, Api, $window, $rootScope, AuthService, projectService) {
    console.log("Creators Ctrl");
    $scope.projectList = [];
    $scope.loaded = false;
    // get created projects
    Api
        .getCreatedProjects(AuthService.getUser().address)
        .then(response => {
            console.log(response);
            $scope.loaded = true;
            $scope.projectList = response;
        })
        .catch(error => console.log(error));

    // redirect to a selected project
    $scope.openProject = (project) => {
        console.log(`called index: ${project}`)
        projectService.addProject(project);
        $window.location.href = `/#/projects/view/${project.address}`;
    }
})

.controller('BackersCtrl', function($scope, Api, $window, $rootScope, AuthService, projectService) {
    console.log("Backers Ctrl");
    $scope.projectList = [];
    $scope.loaded = false;
    // get backed projects
    Api
        .getBackedProjects(AuthService.getUser().address)
        .then(response => {
            console.log(response);
            $scope.loaded = true;
            $scope.projectList = response;
        })
        .catch(error => console.error(error));

    // redirect to a selected project
    $scope.openProject = (project) => {
        console.log(`called index: ${project}`)
        projectService.addProject(project);
        $window.location.href = `/#/projects/view/${project.address}`;
    }
})

.controller('LoginCtrl', function($scope, Api, $window, $rootScope, AuthService, $http, CONFIG, AUTH_EVENTS) {
    console.log("Login Ctrl");

    // check if the user is already authenticated, if so, redirect home
    if (AuthService.isAuthenticated()) {
        $window.location.href = "/#/projects/view";
    }

    // login
    $scope.login = user => {
        if (typeof user.address !== 'number' || user.address < 0 || user.address > 9) {
            $scope.error = "Invalid Address";
        } else {
            AuthService
                .login(user)
                .then(msg => { $window.location.reload(); })
                .catch(errMsg => { $scope.error = errMsg; });
        }

    };

    // block the user on the page until it isn't logged
    $scope.$on('$locationChangeStart', (event) => {
        if (!AuthService.isAuthenticated()) {
            event.preventDefault();
            $window.location.href = "/#/login";
        }
    });
});