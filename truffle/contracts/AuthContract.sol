pragma solidity ^0.5.4;

contract AuthContract {

    address public mainAccount;

    mapping(address => bool) public validAccounts;

    Proxy public proxyContract;

    constructor() public {
        mainAccount = msg.sender;
        proxyContract = Proxy(0x17cB057648a03dE335c773C7F6b7719c63A32eB7);
        validAccounts[0xaCAe83b7925A6a92e02311047b1b030b2F54eA44] = true;
        validAccounts[0x897dC876771D55FB5e5Fa237B66065f51a8A8FB6] = true;
        validAccounts[0x270C6fDA3c1dda23c5572F6a942c25C0A7754aC2] = true;
        validAccounts[0xb22fe67f76598246e040a8192565B02E08eEF11B] = true;
        validAccounts[0x7629e1a91e0aE8Be00e28aA0b81c0Aeff390d9f6] = true;
        validAccounts[0xFDF87b895d37d2C4BCA2713656AaCeFf53c83C39] = true;
        validAccounts[0x36D313e50E1f84aabD39A622E26E3273c7913eC4] = true;
        validAccounts[0x9607eA4a0204a150A3AfEEAc79153e7799150E45] = true;
        validAccounts[0xe64d9C60c727A37c7780755B87AB5279A5dB5c58] = true;
        validAccounts[0x03a518d469dF70c628c78B094c2cA2f4A47f45b5] = true;
        validAccounts[0x96E17975610bddD4D456c668929bB0C63cA05f51] = true;
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