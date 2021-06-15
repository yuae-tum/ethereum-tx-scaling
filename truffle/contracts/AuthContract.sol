pragma solidity ^0.5.4;

contract AuthContract {

    address public mainAccount;

    mapping(address => bool) public validAccounts;

    Proxy public proxyContract;

    constructor() public {
        mainAccount = msg.sender;
    }

    function addAccount(address accountAddress) external {
        require(mainAccount == msg.sender, "unauthorized");
        validAccounts[accountAddress] = true;
    }

    function removeAccount(address accountAddress) external {
        require(mainAccount == msg.sender, "unauthorized");
        validAccounts[accountAddress] = false;
    }

    function setContract(address _address) external {
        require(mainAccount == msg.sender, "unauthorized");
        proxyContract = Proxy(_address);
    }

    function forwardTransaction() external returns (uint) {
        require(validAccounts[msg.sender], "Unknown origin account");
        return proxyContract.processTransaction();
    }

}

contract Proxy {
    function processTransaction() external returns (uint);
}