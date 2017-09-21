var projectContract = require("../build/contracts/Project.json");
var tokenContract = require("../build/contracts/ShareToken.json");

// Unlock the account
// let unlockAccount = () => {
//     console.log(`Unlocking account ${web3.eth.accounts[0]}...`);
//     web3.eth.unlockAccount(web3.eth.accounts[0]); // supermario
// }
// unlockAccount();

// Export the function
module.exports = (web3) => {

    let createToken = data => {

        return new Promise((resolve, reject) => {

            // start a timer
            time.start();
            console.log(`Start creating token ${data.tokenName}...`);
            console.log(data);
            // deploy the contract
            web3.eth
                .contract(tokenContract.abi)
                .new(data.initialSupply, data.tokenName, data.decimals, data.tokenSymbol, {
                    from: data.creator,
                    data: tokenContract.unlinked_binary,
                    gas: '4700000'
                }, function(error, contract) {

                    if (error)
                        reject(error);

                    if (typeof contract.address !== 'undefined') {

                        let result = {
                            address: contract.address,
                            time: time.stop(),
                            instance: contract
                        }

                        resolve(result)
                    }
                });
        });
    }

    let createProject = data => {

        return new Promise((resolve, reject) => {
            // start a timer
            time.start();
            console.log(`Start deploying project ${data.title}...`);

            // deploy the contract
            web3.eth
                .contract(projectContract.abi)
                .new(data.title, data.description, data.goal, data.price, data.token, data.duration, {
                    from: data.creator,
                    data: projectContract.unlinked_binary,
                    gas: '4700000'
                }, function(error, contract) {

                    if (error)
                        reject(error);

                    if (typeof contract.address !== 'undefined') {

                        var result = {
                            creator: data.creator,
                            address: contract.address,
                            time: time.stop(),
                            instance: contract
                        }
                        resolve(result)
                    }
                });
        });
    }

    let time = (function() {
        this.startTime = null;
        this.stopTime = null;
        return {
            start: () => {
                this.startTime = Date.now();
            },
            stop: () => {
                this.stopTime = Date.now();
                return (this.stopTime - this.startTime) / 1000;
            }
        };
    }());

    return {
        createProject: createProject,
        createToken: createToken
    };
}