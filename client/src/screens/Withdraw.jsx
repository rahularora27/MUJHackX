import React from 'react'
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { contractAddress } from '../components/constants';
import { abi } from '../components/constants';
import FormContainer from '../components/FormContainer';



const Withdraw = () => {
  const [balanceState, setBalance] = useState("0.0");
  const [isConnected, toggleConnect] = useState(false);


  async function getBalance() {
    if (typeof window.ethereum != "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(contractAddress);
      toast("The balance is " + ethers.utils.formatEther(balance));
      setBalance(balance.toString()/1000000000000000000); // Convert BigNumber to string before setting it in the state
    } else {
      toast.error("Connect to MetaMask");
    }
  }


  async function withdraw() {
    console.log("Withdrawing....");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      toast.error(erorr);
    }
  }

  async function connect() {
    console.log("we have run connect func");
    if (typeof window.ethereum == "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      toggleConnect(false);
    } else {
      try {
        // Specify the chainId to request connection to a specific network (e.g., Ethereum mainnet)
        await window.ethereum.request({
          method: "eth_requestAccounts",
          params: [
            {
              chainId: "0x1", // Replace with the desired chainId for the network
            },
          ],
        });
        toggleConnect(true); // Update isConnected state to true if connected
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    }
  }

  useEffect(() => {
    connect();
    getBalance();

  }, []);

  
  function listenForTransactionMine(transactionResponse, provider) {
    toast(`Mining ${transactionResponse.hash}...`);
    // return new Promise()
    // create a listener for the blockchain
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        toast(
          `Completed with ${transactionReceipt.confirmations} confirmations`
        );
        resolve();
      });
    });
  }

  return (
    <FormContainer>
        <h1>Withdraw</h1>
        <div>
        
        <h3>Balance of the contract is {balanceState}</h3>
      </div>
      <div className="isConnected">
        You are currently {isConnected ? "connected" : "not connected"} to
        MetaMask
        {!isConnected ? (
          <button className='button' onClick={connect}>Connect to MetaMask</button>
        ) : (
          ""
        )}
        
      </div>

        <div>
        <button className='button' onClick={withdraw}>Withdraw</button>
      </div>
        <ToastContainer />
    </FormContainer>
  )
}

export default Withdraw;