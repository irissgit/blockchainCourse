var CharityFunding = artifacts.require("./CharityFunding.sol");

module.exports = function(deployer) {
  deployer.deploy(CharityFunding);
};
