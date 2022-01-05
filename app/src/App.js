import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
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

        <button className="waveButton bg-indigo-500 text-white" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
