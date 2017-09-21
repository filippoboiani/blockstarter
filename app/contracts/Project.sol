pragma solidity ^0.4.4;

/*
* Project Smart Contract
*
* - Receive Ether from anonymous Backers
* - Update the funding status of the project
* - Show funding status of the project 
* - Kill the project and redistribute the funds (only Creator)
* - Withdraw funds (only Creator)
* - Retrive a share (only Backer)
*
* Notes: 
* The ether cost of each token should be calculated based on the numebr of tokens you are putting up for sale and
* depends on the iniital token supply. Es: goal= 350 initialSupply= 10 partOnSale= 5, then price= 350/5= 70 
*/

// Useful links
// Check this link: https://www.ethereum.org/crowdsale
// Web3 examples https://github.com/fivedogit/solidity-baby-steps/blob/master/contracts/30_endowment_retriever.sol
// Tokens: https://www.ethereum.org/token

contract ShareToken { function transfer(address receiver, uint256 amount){  } }

contract Project {
    // State parameters
    address owner; 
    string public title; 
    string public description; 
    uint public fundingGoal; 
    uint private fundingStatus; 
    uint private finalFundings; 
    
    bool private goalReached; 
    bool private withdrawn;
    address private tokenAddress; 
    ShareToken public token; 
    uint public availableTokens;
    
    // v 2.0 extension 
    uint public deadline; 
    
    // Utility struct
    struct Backer {
        uint amount;  
        bool exists; 
        bool claimed;
    }

    // Support array used to iterate over the mapping 
    address[] iterator;
    // Map of backers and amounts 
    mapping(address => Backer) fundings; 
    
    modifier onlyOwner() {
        if (msg.sender == owner) _;
    }

    modifier onlyAllowedBacker() {
        if (fundings[msg.sender].exists && !fundings[msg.sender].claimed) _;
    }

    modifier campaignOpen() {
        if (!goalReached) _;
    }

    modifier campaignClosed() {
        if (goalReached) _;
    }

    modifier goalNotMet() {
        if (!goalReached && now >= deadline) _;
    }

    // Constructor
    function Project(string _title, string _description, uint _fundingGoal, uint _availableTokens, ShareToken _tokenAdress, uint _campaignDuration) {
        owner = msg.sender;
        title = _title; 
        description = _description; 
        fundingGoal = _fundingGoal * 1 ether; 
        availableTokens = _availableTokens;
        deadline = now + _campaignDuration * 1 minutes; 
        tokenAddress = _tokenAdress;
        token = ShareToken(_tokenAdress);
    }

    // Set all the parameters
    function setParams(string _title, string _description, uint _fundingGoal) onlyOwner {
        title = _title; 
        description = _description; 
        fundingGoal = _fundingGoal; 
    }

    function getInfo() constant returns(string, string, uint, uint, uint, bool, address, uint, address) {
        return(title, description, fundingGoal, fundingStatus, finalFundings, goalReached, owner, deadline, tokenAddress);
    }

    // Shows the status of the project
    function showStatus() constant returns(uint, uint, bool){
        return(fundingGoal, fundingStatus, goalReached);
    }

    // check if the goal has been reached
    function check() onlyOwner returns(bool result) {
        result = false; 
        if(!goalReached && now >= deadline) {
            kill();
        } else {
            result = true; 
        }
    }

    // withdraw funds  
    function withdraw(uint _amount) onlyOwner campaignClosed returns(bool result) {
        result = false;
        // Get the funds 
        _amount = _amount * 1 ether; 
        if (_amount <= fundingStatus) {
            withdrawn = true; 
            fundingStatus -= _amount; 
            owner.send(_amount);
            WithdrawnFunds(true, fundingStatus); // return the fundingStatus after the withdraw 
            result = true;
        } else {
            throw;
        }  
    }

    // Claim shares
    function claimShares() onlyAllowedBacker campaignClosed returns(bool result)  {
        result = false;
        address sender = msg.sender;
        // set the claimed field true
        fundings[sender].claimed = true; 
        // give the token to the backer 
        token.transfer(sender, fundings[sender].amount * availableTokens / finalFundings );
        result = true; 
    }

    // Contract killer
    function kill() goalNotMet {

        // Give back the money to all the backers 
        for (uint i=0; i< iterator.length; i++) {
            address key = iterator[i]; 
            key.send(fundings[key].amount);
        }
        selfdestruct(msg.sender);
    }

    // Fallback function (send money)
    function() payable campaignOpen {

        uint amount = msg.value * 1 ether; 
        address sender = msg.sender; 
        
        if (fundings[sender].exists) {
            fundings[sender].amount += amount; 
        } else {
            fundings[sender] = Backer(amount, true, false);
            iterator.push(sender); 
        }
        
        fundingStatus += amount; 
        finalFundings += amount; 
        goalReached = (fundingStatus >= fundingGoal) && (fundingGoal > 0); 
        SomeoneBacked(sender, amount, goalReached);
    }

    // Events
    event SomeoneBacked(address backer, uint amount, bool goalReached);
    event ShareClaimed(address backer, uint tokens);
    event WithdrawnFunds(bool successful, uint fundsLeft);
}
