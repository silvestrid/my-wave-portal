import { useEffect, useState } from "react";
import { ethers } from "ethers";
import toast, { Toaster } from 'react-hot-toast';

import abi from './utils/WavePortal.json';
import './App.css';



export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const contractAddress = "0x94e69c6b2A0ce5F8038f6CE750a110229E6D6472";
  const contractABI = abi.abi;

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        // from the most recent to the oldest
        wavesCleaned.reverse();
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllWaves();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
        ...prevState,
      ]);
      setTimeout(() => {
        toast(`There's a new wave`, { icon: '🌊' });
      }, 100);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
    getAllWaves();
  }, []);

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(inputValue, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);
        toast.loading("Mining transaction...");

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        toast.dismiss();
        toast.success("Transaction mined...");

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header text-white">
          🚀 Hey there!
        </div>

        <div className="bio text-gray-300 my-4">
          I am Davide and I copy things from other changing a bit the colors so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        {currentAccount &&
          <div className="">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                wave();
              }}
            >
              <textarea
                className="form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                rows="3"
                placeholder="Tell me something!"
                value={inputValue}
                onChange={onInputChange}
              />
              <button type="submit" className="waveButton text-lg bg-indigo-500 text-white">
                Wave at Me
              </button>
            </form>
          </div>
        }

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton text-lg bg-blue-400 text-white" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <div className="py-4">
          {allWaves.map((wave, index) => {
            return (
              <div key={index}
                className={" my-4 px-4 py-2 rounded-lg " + (index % 2 ? "bg-indigo-800 text-gray-100" : "bg-gray-200 text-gray-800")}
              >
                <div className="py-1">
                  <span className="font-bold">Address: </span>
                  {wave.address}
                </div>
                <div className="py-1">
                  <span className="font-bold">Time: </span>
                  {wave.timestamp.toString()}
                </div>
                <div className="py-1">
                  <span className="font-bold">Message: </span>
                  {wave.message}
                </div>
              </div>)
          })}
        </div>
        <Toaster />
      </div>
    </div>
  );
}
