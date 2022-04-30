const { network } = require("hardhat")

// Force a block to be mined
async function moveBlocks(amount) {
    console.log("Moving blocks...")
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
    }
    console.log(`Moved ${amount} blocks`)
}

// Jump forward in time. Takes one parameter, which is the amount of time to increase in seconds
async function moveTime(amount) {
    console.log("Moving blocks...")
    await network.provider.send("evm_increaseTime", [amount])

    console.log(`Moved forward in time ${amount} seconds`)
}

module.exports = {
    moveBlocks,
    moveTime,
}
