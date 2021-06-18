pragma solidity ^0.5.4;

contract BusinessContract {

    address public ourCompanyAccount;

    uint public txCounter;

    constructor() public {
        ourCompanyAccount = 0xF3B6f0Ac5B976aC0bb37dB749d1d6EAeB7df9F58;
    }

    function setAccount(address _address) external {
        ourCompanyAccount = _address;
    }

    function processTransaction() external returns (uint) {
        require(msg.sender == ourCompanyAccount, "unauthorized");
        txCounter++;
        return txCounter;
    }
}
