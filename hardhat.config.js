require("@nomiclabs/hardhat-waffle")
require("hardhat-deploy")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.8.0",
            },
        ],
    },
    namedAccounts: {
        alice: {
            default: 0,
            // default: 0, ethers built in accounts at index[0]
        },
    },
}
