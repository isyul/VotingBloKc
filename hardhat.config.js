require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "150000000000000000000000" // 150,000 ETH in wei
      }
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 40000,
  },
}
