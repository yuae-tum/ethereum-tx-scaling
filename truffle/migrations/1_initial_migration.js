const Migrations = artifacts.require("Migrations");
const AuthContract = artifacts.require("AuthContract");
const DappBackend = artifacts.require("DappBackend");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(AuthContract);
  deployer.deploy(DappBackend);
};
