const BusinessContract = artifacts.require("./BusinessContract.sol");
const AuthContract = artifacts.require("./AuthContract.sol")

module.exports = function(deployer) {
    deployer.deploy(BusinessContract);
    deployer.deploy(AuthContract);
}