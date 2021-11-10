pragma solidity ^0.8.0;

contract AuthContract {

    address public owner;
    mapping(address => bool) public validAccounts;

    event CheckedAuthorization(address indexed account, bool authorized);

    constructor() {
        owner = msg.sender;
        validAccounts[0x020b1FF79Ae9c70D0448AbF5DE1CFEC428666811] = true;
        validAccounts[0x8A6d692d2D63dB9E5438d150e82Bc15757F132F5] = true;
        validAccounts[0x7006D8acC44598b5e91Ca23BaEa6C281cf2C9e8A] = true;
        validAccounts[0x6C8CE045BD452f3Ae2146182A24FCD032B8781a1] = true;
        validAccounts[0x23f6A88DdAdB4E698500020C9981868Aa4538996] = true;
        validAccounts[0x84b3CE9f9A28Ca918FFfc01B23BFA1C2c1755A90] = true;
        validAccounts[0xe043838318c63914daa25f94E3Cf367dd12E88A4] = true;
        validAccounts[0x3a0aF0DBcEf7BB387a29C58BAaa4b8EF30768c76] = true;
        validAccounts[0xBc78b2A3AA21629c618B0a9fF84B510E9E07a3FD] = true;
        validAccounts[0xDb069094B30DE82124949B4024a9956a2325933C] = true;
    }

    function addAccount(address accountAddress) external {
        require(owner == msg.sender, "unauthorized");
        validAccounts[accountAddress] = true;
    }

    function removeAccount(address accountAddress) external {
        require(owner == msg.sender, "unauthorized");
        validAccounts[accountAddress] = false;
    }

    function checkAuthorization(address accountAddress) external returns (bool) {
        bool isAuthorized = validAccounts[accountAddress];
        emit CheckedAuthorization(accountAddress, isAuthorized);
        return isAuthorized;
    }

}