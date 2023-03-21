const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();


    // We need a signer that has an address lesser or equal than the threshold
    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

    // Get a signer
    let signer = ethers.provider.getSigner(0);
    // Get another signer to send funds later
    let signer1 = ethers.provider.getSigner(1);

    // Get the address of the signer
    let address = (await signer.getAddress()) .toString();
    // console.log(address);

    // Safeguard var to avoid great loops
    let attempts = 0;

    // Loop until we get an address lesser or equal than the threshold
    while (address > threshold) {
      // Get another random signer
      signer = ethers.Wallet.createRandom();

      // Get the address of the new signer
      address = (await signer.getAddress()).toString();

      // update the number of attempts and exit the loop if we reach a certain number of attempts
      attempts++;
      if (attempts >= 1000) {
        console.log("Cagada");
        continue;
      }
    }
    // console.log(address);
    // Signer found
    // Connect the signer to the provider
    signer =  signer.connect(ethers.provider);
    // Send 1 ETH from one of the initial signers to the random signer found
    await signer1.sendTransaction({to: signer.address, value: ethers.utils.parseEther("1")});

    // console.log("0x000fFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf" < "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf");
    // while (signer.getAddress() > threshold) {
      
    // }

    return { game, signer };
  }
  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);

    // good luck
    // contract Game5 {
    //   bool public isWon;
    
    //   address threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
    
    //   function win() external {
    //     require(bytes20(msg.sender) < bytes20(threshold), "Nope. Try again!");
    
    //     isWon = true;
    //   }
    // }



    await game.connect(signer).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
