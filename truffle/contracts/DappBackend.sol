pragma solidity ^0.8.0;

contract DappBackend {

    address public owner;
    AuthContractProxy auth;

    int public currentValue;

    event ValueUpdated(address indexed by, int valueBefore, int valueNow);

    constructor() {
        owner = msg.sender;
        auth = AuthContractProxy(0xe7a00277408C45ff7755CfA58084cC7d7825b534);
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