const Database = require("./database");
const CreatorDB = new Database(require('../models/creators'));
const BackerDB = new Database(require('../models/backers'));

module.exports = (app, web3) => {

    // Controllers
    let deployer = require("./deploy")(web3);
    let interactor = require("./interaction")(web3);
    let scheduler = require("./scheduler")(interactor, CreatorDB, BackerDB);

    console.info("API running...");

    // Get Hello World
    app.get('/api/v1/', function(req, res, next) {
        logRequest(req);
        res.send("Hello, this is group E (Boiani, Sibani, Stojkovski, Vilén, Jamiulahmadi, Akhlaqi, Ayobi, Sajid)!\n");
    });

    // Create a project
    app.post('/api/v1/projects', function(req, res, next) {

        logRequest(req);
        let request = req.body;

        // set some additional values 
        request.token.decimals = 4;
        request.project.token = "todo...";
        // convert account index to account address
        request.token.creator = web3.eth.accounts[request.token.creator];
        request.project.creator = web3.eth.accounts[request.project.creator];

        console.log(request);

        // Deploy the project  
        deployer
            .createToken(request.token)
            .then(result => {

                // set the token address inside the project
                request.project.token = result.address;
                console.log(`Token ${result.address} created in ${result.time} seconds`);
                // create the project and add a promise to the chain
                return deployer.createProject(request.project);
            })
            .then(result => {

                console.log(`Inserting ${request.project.title} into ${result.creator} projects list by ${request.project.creator}`);
                let deadline = new Date().setTime(new Date().getTime() + (request.project.duration * 60 * 1000));
                //write to mongoDB
                let query = {
                    $push: {
                        "projects": {
                            address: result.address, // project contract address
                            token: request.project.token, // token contract address
                            deadline: deadline
                        }
                    }
                }

                // TODO: change the promise: http://mongoosejs.com/docs/promises.html
                CreatorDB
                    .update(result.creator, query)
                    .then(result => console.log(result))
                    .catch(error => console.log(error));

                let data = {
                    creator: result.creator,
                    project: result.address
                };
                // var r = `Project ${request.project.title} with address ${result.address} created in ${result.time} seconds\n`;
                // set the scheduler
                let s = scheduler.setScheduler({ deadline: deadline }, data);
                res.send(result);

            })
            .catch(error => res.send(error))
            .catch(error => res.send(error));
    });

    // Fund a project
    app.post('/api/v1/projects/fund', function(req, res, next) {

        logRequest(req);
        let funding = req.body;
        funding.backer = web3.eth.accounts[req.body.backer];

        interactor
            .fundProject(funding)
            .then(result => {
                let backer = funding.backer;
                let query = { $addToSet: { projects: { address: funding.project } } };

                // write on db
                // TODO: change the promise: http://mongoosejs.com/docs/promises.html
                BackerDB
                    .update(backer, query)
                    .then(result => console.log(result))
                    .catch(error => console.log(error));

                res.send(result);
            })
            .catch(error => {
                console.log(error);
                res.send(error);
            });
    });

    // Get all projects
    app.get('/api/v1/projects', function(req, res, next) {
        logRequest(req);

        CreatorDB
            .aggregate([{ $unwind: "$projects" }, {
                $project: { _id: 0, address: "$projects.address", deadline: "$projects.deadline", token: "$projects.token" }
            }])
            .then(result => {
                return interactor.getAllProjects(result);
            })
            .then(result => res.send(result))
            .catch(error => res.send(error));


    });

    // Get all projects created by a creator
    app.get('/api/v1/projects/creator/:creator', function(req, res, next) {

        logRequest(req);
        // convert account index to account address
        let creator = web3.eth.accounts[req.params.creator];
        let query = { _id: creator }
        CreatorDB
            .getProjectsByAddress(query)
            .then(result => {
                let projects = result[0].projects;
                return interactor.getAllProjects(projects);
            })
            .then(result => res.send(result))
            .catch(error => res.send(error));
    });

    // Get all projects funded by a backer
    app.get('/api/v1/projects/backer/:backer', function(req, res, next) {

        logRequest(req);
        // convert account index to account address
        let backer = web3.eth.accounts[req.params.backer];
        let query = { _id: backer }

        BackerDB
            .getProjectsByAddress(query)
            .then(result => {
                console.log("Result\n", result);
                let projects = result[0].projects;
                return interactor.getAllProjects(projects);
            })
            .then(result => res.send(result))
            .catch(error => res.send(error));
    });

    // Show project status
    app.get('/api/v1/projects/status/:project', function(req, res, next) {

        logRequest(req);
        let data = req.params;

        interactor
            .showStatus(data)
            .then(result => res.send(result))
            .catch(error => res.send(error));

    });

    // Show project information
    app.get('/api/v1/projects/:project', function(req, res, next) {

        logRequest(req);
        let data = req.params;

        interactor
            .getProject(data)
            .then(result => res.send(result))
            .catch(error => res.send(error));
    });

    // Withdraw funds from the project
    app.post('/api/v1/projects/withdraw', function(req, res, next) {
        logRequest(req);

        let data = req.body;
        data.creator = web3.eth.accounts[data.creator];

        interactor
            .withdrawFunds(data)
            .then(result => res.send(result))
            .catch(error => res.send(error));
    });

    // Show project shares 
    app.post('/api/v1/projects/show/shares', function(req, res, next) {
        logRequest(req);

        let data = req.body;
        data.backer = web3.eth.accounts[data.backer];

        interactor
            .showShares(data)
            .then(result => res.send(result))
            .catch(error => res.send(error));


    });

    // Claim project shares 
    app.post('/api/v1/projects/claim-shares', function(req, res, next) {
        logRequest(req);

        let data = req.body;
        data.backer = web3.eth.accounts[data.backer];

        interactor
            .claimShares(data)
            .then(result => res.send(result))
            .catch(error => res.send(error));


    });

    // Log utility
    let logRequest = req => {
        console.log("-------------------------------------------------------------");
        console.log(req.method + " on " + req.originalUrl);
        console.log("params:\n", req.params);
        console.log("body:\n", req.body);
    }

}