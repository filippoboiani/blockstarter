var Migrations = artifacts.require("Migrations");
var Project = artifacts.require("Project");
var ShareToken = artifacts.require("ShareToken");


module.exports = function(deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(Project).then(function(instance) {
        console.log(instance);
    });
    deployer.deploy(ShareToken).then(function(instance) {
        console.log(instance);
    });

};