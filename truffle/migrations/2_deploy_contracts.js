const TransferContract = artifacts.require("./TransferContract.sol");
const TestContract = artifacts.require("./TestContract.sol");
const SeminarContract = artifacts.require("./SeminarContract.sol");
const BusinessContract = artifacts.require("./BusinessContract.sol");
const AuthContract = artifacts.require("./AuthContract.sol")

module.exports = function(deployer) {
    //deployer.deploy(TransferContract);
    //deployer.deploy(TestContract);
    //deployer.deploy(SeminarContract);
    deployer.deploy(BusinessContract);
    deployer.deploy(AuthContract);
}