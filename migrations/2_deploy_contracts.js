var Collectible = artifacts.require("./CollectibleStore.sol");


module.exports = function (deployer) {
  deployer.deploy(Collectible);
};
