## Minimal defi staking contract created with brownie.

## Requirements

- [brownie](https://eth-brownie.readthedocs.io/en/stable/install.html)
  - You can test it's installed by running `brownie --version`
- [python](https://www.python.org/downloads/)
  - You can test it's installed by running `python --version` or `python3 --version`
- [nodejs](https://nodejs.org/en/download/)
  - You can test it's installed by running `node --version`
- [yarn](https://yarnpkg.com/)
  - You can test it's installed by running `yarn --version`
- [git](https://git-scm.com/downloads)
  - You can test it's installed by running `git --version`
- [ganache-cli](https://www.npmjs.com/package/ganache-cli)
  - You can test it's installed by running `ganache-cli --version`

## Installation

Git clone this repo

```sh
git clone staking-defi
git checkout defi-brownie
cd brownie
```

## Quickstart

Run:

```sh
brownie run scripts/deploy.py
```

And this will print out the contracts addresses.

## Testnet deployment

To deploy to a testnet, you'll need.

1. [A Blockchain wallet](https://metamask.io/)
2. [Testnet ETH](https://faucets.chain.link/) in your Blockchain Wallet.
3. [An infura project ID](https://infura.io/)
4. [An Etherscan API Key](https://etherscan.io/apis)

Then, create a `.env` file and add the following lines:

```
ETHERSCAN_API_KEY=ABC123ABC123ABC123ABC123ABC123ABC1
WEB3_INFURA_PROJECT_ID=ABC123ABC123ABC123ABC123ABC123ABC1
PRIVATE_KEY=YOUR_BLOCKCHAIN_WALLET_PRIVATE_KEY
```

DO NOT PUSH YOUR PRIVATE_KEY TO GITHUB. Please test and develop with a private key that doesn't have any real money in it.

Then, run:

```sh
brownie run scripts/deploy.py --network rinkeby
```

And it will deploy and auto-verify for you.

## Testing

```sh
brownie test
```
