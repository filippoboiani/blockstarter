pragma solidity ^0.4.4;

/*
* Token rapresenting a share in the Project
* 
* The token is initialized with an initial supply and it is called when a backer funds the project. 
* The backer receives shares corresponding to the amount funded. 
*
* The token should be initialized before each project, as its address is part of the parameters 
* required for the Project creation. 
*
* The token was taken from Ethereum documentation. 
*/

contract ShareToken {
    address creator;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 private initialSupply;
    /* This creates an array with all balances */
    mapping (address => uint256) balanceOf;

    // This generates a public event on the blockchain that will notify clients 
    event Transfer(address from, address to, uint256 value, uint256 initialSupply, string name, string symbol);

    // Initializes contract with initial supply tokens to the creator of the contract 
    function ShareToken(uint256 _initialSupply, string _tokenName, uint8 _decimalUnits, string _tokenSymbol) {
        if (_initialSupply == 0) {
            _initialSupply = 100; 
        }
        creator = msg.sender;
        initialSupply = _initialSupply;
        balanceOf[creator] = _initialSupply;                // Give the creator all initial tokens
        name = _tokenName;                                  // Set the name for display purposes
        symbol = _tokenSymbol;                              // Set the symbol for display purposes
        decimals = _decimalUnits;                           // Amount of decimals for display purposes
    }

    function tokenLeft() constant returns(uint256) {
        return balanceOf[creator];
    }

    function showShares() constant returns(uint256, uint256) {
        return (balanceOf[msg.sender], initialSupply);
    }

    // Send coins 
    function transfer(address _to, uint256 _value) {
        balanceOf[creator] -= _value;                       // Subtract from the creator
        balanceOf[_to] += _value;                           // Add the same to the recipient
        Transfer(creator, _to, _value, initialSupply, name, symbol);
        
    }
    
}