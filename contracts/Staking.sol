// stake

// unstake

// claim rewards

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error Staking__TransferFailed();
error Staking__NeedsMoreThanZero();

contract Staking {
    IERC20 private s_stakingToken;
    IERC20 private s_rewardsToken;

    uint256 private s_totalSupply;
    uint256 private s_rewardPerTokenStored;
    uint256 private s_lastUpdateTime;
    uint256 public constant REWARD_RATE = 100; // PER SECOND

    // address => stake
    mapping(address => uint256) public s_balances;

    // address => rewards
    mapping(address => uint256) public s_rewards;

    // address => amount paid
    mapping(address => uint256) public s_userRewardPerTokenPaid;

    event Staked(address indexed user, uint256 indexed amount);
    event WithdrewStake(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed amount);

    constructor(address stakingToken, address rewardsToken) {
        s_stakingToken = IERC20(stakingToken);
        s_rewardsToken = IERC20(rewardsToken);
    }

    function rewardPerToken() public view returns (uint256) {
        if (s_totalSupply == 0) {
            return s_rewardPerTokenStored;
        }

        // block.timestamp - s_lastUpdateTime is in seconds
        return
            s_rewardPerTokenStored +
            (((block.timestamp - s_lastUpdateTime) * REWARD_RATE * 1e18) / s_totalSupply);
    }

    modifier updateRewards(address account) {
        s_rewardPerTokenStored = rewardPerToken();
        s_lastUpdateTime = block.timestamp;
        s_rewards[account] = earned(account);
        s_userRewardPerTokenPaid[account] = s_rewardPerTokenStored;
        _;
    }

    modifier moreThanZero(uint256 amount) {
        if (amount == 0) {
            revert Staking__NeedsMoreThanZero();
        }
        _;
    }

    function earned(address account) public view returns (uint256) {
        uint256 currentBalance = s_balances[account];
        uint256 amountPaid = s_userRewardPerTokenPaid[account];
        uint256 currentRewardPerToken = rewardPerToken();
        uint256 pastRewards = s_rewards[account];
        uint256 _earned = ((currentBalance * (currentRewardPerToken - amountPaid)) / 1e18) +
            pastRewards;

        return _earned;
    }

    function stake(uint256 amount) external updateRewards(msg.sender) moreThanZero(amount) {
        s_balances[msg.sender] = s_balances[msg.sender] + amount;
        s_totalSupply = s_totalSupply + amount;
        emit Staked(msg.sender, amount);
        bool success = s_stakingToken.transferFrom(msg.sender, address(this), amount);
        // require(success, "Transfer Failed"); revert after transactions to prevent re-entry
        if (!success) {
            revert Staking__TransferFailed();
        }
    }

    function withdraw(uint256 amount) external updateRewards(msg.sender) moreThanZero(amount) {
        s_balances[msg.sender] = s_balances[msg.sender] - amount;
        s_totalSupply = s_totalSupply - amount;
        emit WithdrewStake(msg.sender, amount);
        bool success = s_stakingToken.transfer(msg.sender, amount);
        if (!success) {
            revert Staking__TransferFailed();
        }
    }

    function claimReward() external updateRewards(msg.sender) {
        uint256 reward = s_rewards[msg.sender];
        bool success = s_rewardsToken.transfer(msg.sender, reward);
        emit RewardsClaimed(msg.sender, reward);
        if (!success) {
            revert Staking__TransferFailed();
        }
        // How much reward do they get?
        // The contract is going to emit X (100) tokens per second
        // And disperse them to all token stakers
        //
        // e.g: 100 reward tokens/second
        // stakes: 50, 20, 30
        // rewards: 50, 20, 30
        //
        // staked: 100,50, 20, 30
        // rewards: 500, 35, 20, 25
    }

    function getStakingToken() public view returns (IERC20) {
        return s_stakingToken;
    }

    function getRewardsToken() public view returns (IERC20) {
        return s_rewardsToken;
    }

    function getTotalSupply() public view returns (uint256) {
        return s_totalSupply;
    }

    function getRewardsPerTokenStored() public view returns (uint256) {
        return s_rewardPerTokenStored;
    }

    function getLastUpdateTime() public view returns (uint256) {
        return s_lastUpdateTime;
    }
}
