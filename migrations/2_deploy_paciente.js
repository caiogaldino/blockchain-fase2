const Paciente = artifacts.require("Paciente");

module.exports = function(deployer) {
  deployer.deploy(Paciente);
};