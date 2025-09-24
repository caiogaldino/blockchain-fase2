module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // localhost
      port: 7545,         // porta Ganache GUI (ou 8545 se CLI)
      network_id: "5777"     // aceita qualquer network id
    }
  },

  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};