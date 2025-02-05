import { TenderlySimulationProvider } from "./tenderlySimulationProvider";
import { parseEther, parseAbi, encodeFunctionData } from "viem";

async function testTenderlyContractSimulation() {
  const config = {
    slug: "tenderly_slug",
    accessKey: "tenderly_access_key",
    projectId: "furies"
  };

  const provider = new TenderlySimulationProvider(config);

  const mockWalletProvider = {
    getNetwork: async () => ({ chainId: 137 }), // Goerli testnet
    getAddress: async () => "any_address"
  };

  try {
    console.log("Starting contract simulation tests");

    // Example 1: Testing an ERC20 transfer
    const erc20ContractAddress = "Contract_Address"; // Example LINK token on Goerli
    const erc20Transfer = {
      to: erc20ContractAddress,
      data: encodeFunctionData({
        abi: parseAbi(["function transfer(address to, uint256 amount)"]),
        functionName: "transfer",
        args: [
          "0x2859566f09347f9d5dedb06e2d50698338ad87e4", // recipient
          parseEther("1.0") // amount
        ]
      }),
      value: "0x0" // No ETH being sent
    };

    console.log("Simulating ERC20 transfer...");
    const erc20Result = await provider.simulateTransaction(
      mockWalletProvider as any,
      erc20Transfer
    );
    console.log("ERC20 transfer simulation result:", erc20Result);

    // Example 2: Testing a contract with multiple parameters
    const stakingContractAddress = "Contract_address"; // Replace with actual contract
    const stakingDeposit = {
      to: stakingContractAddress,
      data: encodeFunctionData({
        abi: parseAbi(["function deposit(uint256 amount, uint256 lockPeriod)"]),
        functionName: "deposit",
        args: [
          parseEther("5.0"), // amount
          BigInt(2592000) // lock period in seconds (30 days)
        ]
      }),
      value: parseEther("5.0").toString() // If the staking requires ETH
    };

    console.log("Simulating staking deposit...");
    const stakingResult = await provider.simulateTransaction(
      mockWalletProvider as any,
      stakingDeposit
    );
    console.log("Staking deposit simulation result:", stakingResult);

    // Example 3: Testing a view function (no state changes)
    const viewFunctionCall = {
      to: erc20ContractAddress,
      data: encodeFunctionData({
        abi: parseAbi(["function balanceOf(address account) view returns (uint256)"]),
        functionName: "balanceOf",
        args: ["0x34ca07dB523C2Ea867BD1D1DCcC46dE3eB6DaaE3"]
      })
    };

    console.log("Simulating view function call...");
    const viewResult = await provider.simulateTransaction(
      mockWalletProvider as any,
      viewFunctionCall
    );
    console.log("View function simulation result:", viewResult);

  } catch (error: any) {
    console.error("Simulation error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
  }
}

testTenderlyContractSimulation().catch(console.error);