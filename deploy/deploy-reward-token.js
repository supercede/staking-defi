module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { alice } = await getNamedAccounts()

    const rewardToken = await deploy("RewardToken", {
        from: alice,
        args: [],
        log: true,
    })
}

module.exports.tags = ["all", "rewardToken"]
