pragma solidity ^0.8.0;

contract DappBackend {

    address public owner;
    AuthContractProxy auth;

    int public currentValue;

    event ValueUpdated(address indexed by, int valueBefore, int valueNow);

    constructor() {
        owner = msg.sender;
        auth = AuthContractProxy(0x0b9c4c3D0a54c2bB572B830531903a9994015e34);
    }

    function setAuthContract(address contractAddress) external {
        require(msg.sender == owner, "unauthorized");
        auth = AuthContractProxy(contractAddress);
    }

    function processTransaction(int number) external {
        bool authorized = auth.checkAuthorization(msg.sender);
        require(authorized, "unauthorized");
        int valueBefore = currentValue;
        currentValue = number;
        emit ValueUpdated(msg.sender, valueBefore, currentValue);
    }

}

abstract contract AuthContractProxy {
    function checkAuthorization(address accountAddress) external virtual returns (bool);
}