const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { alice } = await getNamedAccounts()
    const rewardToken = await ethers.getContract("RewardToken")

    const stakingDeployment = await deploy("Staking", {
        from: alice,
        args: [rewardToken.address, rewardToken.address],
        log: true,
    })
}

module.exports.tags = ["all", "staking"]
