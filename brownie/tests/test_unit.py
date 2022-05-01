from brownie import chain
from scripts.deploy import deploy_reward_token, deploy_staking
from scripts.helpers import get_account
from web3 import Web3

STAKING_AMOUNT = Web3.toWei(100000, "ether")
SECONDS_IN_A_DAY = 86400
SECONDS_IN_A_YEAR = 31536000


def test_set_reward_token_address():
    (staking, reward_token) = deploy_staking()

    reward_token_address = staking.getRewardsToken()
    assert reward_token_address == reward_token.address


def test_return_rewards_amount_of_token():
    account = get_account()
    (staking, reward_token) = deploy_staking()
    tx = reward_token.approve(staking.address, STAKING_AMOUNT, {"from": account})
    tx.wait(1)

    staking.stake(STAKING_AMOUNT)

    chain.sleep(SECONDS_IN_A_DAY)
    chain.mine(1)

    reward = staking.rewardPerToken()
    expectedReward = "86"
    assert reward == expectedReward

    chain.sleep(SECONDS_IN_A_YEAR - SECONDS_IN_A_DAY)
    chain.mine(1)

    reward = staking.rewardPerToken()
    expectedReward = "31536"
    assert reward == expectedReward


def test_move_token_from_user_to_contract():
    account = get_account()
    (staking, reward_token) = deploy_staking()
    tx = reward_token.approve(staking.address, STAKING_AMOUNT, {"from": account})
    tx.wait(1)

    staking.stake(STAKING_AMOUNT)

    chain.sleep(SECONDS_IN_A_DAY)
    chain.mine(1)

    earned = staking.earned(account)
    expectedEarned = "8600000"

    assert earned == expectedEarned


def test_add_user_withdrawal_to_wallet():
    account = get_account()
    (staking, reward_token) = deploy_staking()
    tx = reward_token.approve(staking.address, STAKING_AMOUNT, {"from": account})
    tx.wait(1)

    staking.stake(STAKING_AMOUNT)

    chain.sleep(SECONDS_IN_A_DAY)
    chain.mine(1)

    balance_before = reward_token.balanceOf(account.address)
    staking.withdraw(STAKING_AMOUNT)

    balance_after = reward_token.balanceOf(account.address)
    earned = staking.earned(account)
    expectedEarned = 8600000

    assert expectedEarned == earned
    assert balance_before + STAKING_AMOUNT == balance_after


def test_user_can_claim_reward():
    account = get_account()
    (staking, reward_token) = deploy_staking()
    tx = reward_token.approve(staking.address, STAKING_AMOUNT, {"from": account})
    tx.wait(1)

    staking.stake(STAKING_AMOUNT)

    chain.sleep(SECONDS_IN_A_DAY)
    chain.mine(1)

    earned = staking.earned(account.address)
    balance_before = reward_token.balanceOf(account.address)
    staking.claimReward()
    balance_after = reward_token.balanceOf(account.address)

    assert balance_before + earned == balance_after
