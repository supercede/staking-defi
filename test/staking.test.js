const { assert, expect } = require("chai")
const { ethers, deployments } = require("hardhat")
const { moveBlocks, moveTime } = require("../utils/helpers")

const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_YEAR = 31536000

describe("Staking test", async function () {
    let staking, rewardToken, alice, stakeAmount

    beforeEach(async function () {
        const accounts = await ethers.getSigners()
        alice = accounts[0]
        await deployments.fixture(["all"])
        staking = await ethers.getContract("Staking")
        rewardToken = await ethers.getContract("RewardToken")
        stakeAmount = ethers.utils.parseEther("100000")
    })

    describe("constructor", () => {
        it("sets the rewards token address correctly", async () => {
            const response = await staking.getRewardsToken()
            assert.equal(response, rewardToken.address)
        })
    })

    it("Returns the reward amount of 1 token based time spent locked up", async function () {
        await rewardToken.approve(staking.address, stakeAmount)
        await staking.stake(stakeAmount)

        await moveTime(SECONDS_IN_A_DAY)
        await moveBlocks(1)

        let reward = await staking.rewardPerToken()
        let expectedReward = "86"
        assert.equal(reward.toString(), expectedReward)

        // 1 day moved previously
        await moveTime(SECONDS_IN_A_YEAR - SECONDS_IN_A_DAY)
        await moveBlocks(1)

        reward = await staking.rewardPerToken()
        expectedReward = "31536"
        assert.equal(reward.toString(), expectedReward)
    })

    it("Moves tokens from the user to the staking contract", async () => {
        await rewardToken.approve(staking.address, stakeAmount)
        await staking.stake(stakeAmount)

        await moveTime(SECONDS_IN_A_DAY)
        await moveBlocks(1)

        const earned = await staking.earned(alice.address)
        const expectedEarned = "8600000"
        assert.equal(expectedEarned, earned.toString())
    })

    it("Moves tokens from the user to the staking contract", async () => {
        await rewardToken.approve(staking.address, stakeAmount)
        await staking.stake(stakeAmount)

        await moveTime(SECONDS_IN_A_DAY)
        await moveBlocks(1)

        const balanceBefore = await rewardToken.balanceOf(alice.address)
        await staking.withdraw(stakeAmount)
        const balanceAfter = await rewardToken.balanceOf(alice.address)
        const earned = await staking.earned(alice.address)
        const expectedEarned = "8600000"

        assert.equal(expectedEarned, earned.toString())
        assert.equal(balanceBefore.add(stakeAmount).toString(), balanceAfter.toString())
    })

    it("Users can claim their rewards", async () => {
        await rewardToken.approve(staking.address, stakeAmount)
        await staking.stake(stakeAmount)

        await moveTime(SECONDS_IN_A_DAY)
        await moveBlocks(1)

        const earned = await staking.earned(alice.address)
        const balanceBefore = await rewardToken.balanceOf(alice.address)
        await staking.claimReward()
        const balanceAfter = await rewardToken.balanceOf(alice.address)
        assert.equal(balanceBefore.add(earned).toString(), balanceAfter.toString())
    })
})
