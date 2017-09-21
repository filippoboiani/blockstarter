angular.module('Blockstarter.api', ['Blockstarter.config'])

.factory('Api', function($http, CONFIG, $window, $timeout, $q) {

    this.getAllProjects = () => {
        return $http
            .get(CONFIG.endpoint + '/projects')
            .then(response => { return response.data; })
            .catch(error => { return error; });
    };

    this.addProject = function(project) {
        return $http
            .post(CONFIG.endpoint + '/projects', project)
            .then(response => { return response.data; })
            .catch(error => { return error; });
    }

    this.getCreatedProjects = function(creator) {

        return $http
            .get(CONFIG.endpoint + '/projects/creator/' + creator)
            .then(response => { return response.data; })
            .catch(error => { return error; });
    }

    this.getInfo = function(projectAddress) {
        return $http
            .get(CONFIG.endpoint + '/projects/' + projectAddress)
            .then(response => { return response.data; })
            .catch(error => { return error; })
    }

    this.getProject = function(projectAddress) {
        return $http
            .get(CONFIG.endpoint + '/projects/' + projectAddress)
            .then(response => { return response.data; })
            .catch(error => { return error; })
    }

    this.backProject = function(fund) {
        return $http
            .post(CONFIG.endpoint + '/projects/fund', fund)
            .then(response => { return response.data; })
            .catch(error => { return error; });
    }

    this.getBackedProjects = function(backer) {
        return $http
            .get(`${CONFIG.endpoint}/projects/backer/${backer}`)
            .then(response => {
                console.log('Project by backer', response);
                return response.data;
            })
            .catch(error => { return error; });
    }

    this.withdrawProject = function(data) {
        return $http
            .post(CONFIG.endpoint + '/projects/withdraw', data)
            .then(response => response.data)
            .catch(error => error);
    }

    this.showShares = function(data) {
        return $http
            .post(CONFIG.endpoint + '/projects/show/shares', data)
            .then(response => response.data)
            .catch(error => error);
    }

    this.claimShares = function(data) {
        return $http
            .post(CONFIG.endpoint + '/projects/claim-shares', data)
            .then(response => response.data)
            .catch(error => error);
    }

    // self.getUsers = function() {
    //     return $http.get(CONFIG.endpoint + CONFIG.users).then(
    //         function(response) {
    //             return response.data;
    //         },
    //         function(error) {
    //             return error;
    //         });
    // };

    // self.getCurrentUser = function() {
    //     return $http.get(CONFIG.endpoint + CONFIG.user).then(function(result) {
    //         return result.data;
    //     }, function(error) {
    //         return error;
    //     });
    // };

    return this;
});