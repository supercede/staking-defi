from brownie import config, network, Staking, RewardToken
from scripts.helpers import get_account, LOCAL_ENVIRONMENTS


def deploy_reward_token():
    account = get_account()
    reward_token = RewardToken.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify"),
    )
    print(f"Contract deployed to {reward_token.address}")
    return reward_token


def deploy_staking():
    account = get_account()
    reward_token = deploy_reward_token()

    staking = Staking.deploy(
        reward_token.address,
        reward_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify"),
    )

    print(f"Contract deployed to {staking.address}")
    return (staking, reward_token)


def main():
    deploy_staking()
