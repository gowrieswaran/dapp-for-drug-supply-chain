// migrating the appropriate contracts
var DistributorRole = artifacts.require("./DistributorRole.sol");
var ManufacturerRole = artifacts.require("./ManufacturerRole.sol");
var PharmacistRole = artifacts.require("./PharmacistRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(ManufacturerRole);
  deployer.deploy(DistributorRole);
  deployer.deploy(PharmacistRole);
  deployer.deploy(SupplyChain);
};
