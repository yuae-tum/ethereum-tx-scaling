pragma solidity ^0.5.4;

contract BusinessContract {

    address public ourCompanyAccount;

    uint public txCounter;

    function setAccount(address _address) external {
        ourCompanyAccount = _address;
    }

    function processTransaction() external returns (uint) {
        require(msg.sender == ourCompanyAccount, "unauthorized");
        txCounter++;
        return txCounter;
    }
}
