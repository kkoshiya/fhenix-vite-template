import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';  // Correct import for ethers v6
import { FhenixClient, EncryptionTypes, getPermit } from 'fhenixjs';
import contractABI from './abi/sampleAbi.json';  // Replace with the path to your ABI file
//import initWasmModule from './example.wasm';

// Your contract address (replace with actual deployed contract address)
//const contractAddress = '0x29E6Bbd943D17aB25039D3083A7fF314f58a1613'; //helium
const contractAddress = '0x62CaE4060C13563dF73c13a2A69C17AF98ede3Ca'; //nitrogen


function App() {
  const [account, setAccount] = useState(null);  // Account state
  const [provider, setProvider] = useState(null); // Provider state
  const [client, setClient] = useState(null);
  const [contract, setContract] = useState(null);
  const [inputValue, setInputValue] = useState('');  // Value from the user input

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum); // Updated for ethers v6
        await provider.send('eth_requestAccounts', []); // Request MetaMask accounts access
        const signer = await provider.getSigner(); // Get the signer
        const account = await signer.getAddress(); // Get account address as a string
        // initialize Fhenix Client
        const client = new FhenixClient({provider});
        setAccount(account); // Store account address
        setClient(client);

        // Create contract instance using ethers v6
        const contractInstance = new Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
        console.log('Contract instance created:', contractInstance);

        console.log(account);
        console.log(typeof account);
        setProvider(provider);
        console.log("Connected account:", account); // Log to see what 'account' looks like
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Check connection and set account
  useEffect(() => {
    if (provider) {
      const checkConnection = async () => {
        const accounts = await provider.listAccounts(); // Get accounts from the provider
        if (accounts.length > 0) setAccount(accounts[0]); // Use the first account
      };  
    }
  }, [provider]);

  // function for setting ciphertext
  const setCipherText = async () => {
    if (contract && inputValue) {
      try {
        // Call the setValue write function on the contract
        const encyrptedAmount = await client.encrypt(Number(inputValue), EncryptionTypes.uint8);

        const tx = await contract.setHighestNumber(encyrptedAmount);  // Send transaction
        console.log('Transaction sent:', tx);
        //Wait for the transaction to be mined
        await tx.wait();  
        console.log('Transaction mined:', tx);
      } catch (error) {
        console.error('Error writing to contract:', error);
      }
    } else {
      console.log('Contract not initialized or input value missing');
    }
  };

  // const getSealOuput = async () => {
  //   if (contract) {
  //     try {
  //       // Call read sealoutput function
  //       const permit = await getPermit(contractAddress, provider);
  //       client.storePermit(permit);
  //       const permission = client.extractPermitPermission(permit);
  //       const response = await contract.getSealedOutput(permission);
  //       const plaintext = client.unseal(contractAddress, response);
  //       console.log(`My Balance: ${plaintext}`)
  //     } catch (error) {
  //       console.error('Error writing to contract:', error);
  //     }
  //   } else {
  //     console.log('Contract not initialized or input value missing');
  //   }
  // };

  const getSealOuput = async () => {
    if (contract) {
      try {
        // Call read sealoutput function
        const permit = await getPermit(contractAddress, provider);
        client.storePermit(permit);
        const permission = client.extractPermitPermission(permit);
        console.log(permission);
        const response = await contract.getSealedOutput(permission);
        const plaintext = client.unseal(contractAddress, response);
        console.log(`SealOutput: ${plaintext}`)
      } catch (error) {
        console.error('Error writing to contract:', error);
      }
    } else {
      console.log('Contract not initialized or input value missing');
    }
  };


  const addToyPlain = async () => {
    if (contract) {
      try {
        const tx = await contract.addToyPlain();  // Send transaction
        console.log('Transaction sent:', tx);
        //Wait for the transaction to be mined
        await tx.wait();  
        console.log('Transaction mined:', tx);
      } catch (error) {
        console.error('Error writing to contract:', error);
      }
    } else {
      console.log('Contract not initialized or input value missing');
    }
  };

  return (
    <div>
      <h1>Fhenix DApp Template 2</h1>
      <div>
        {account ? (
          // Ensure account is a string and render it
          <p>Connected account: {account.address}</p>
        ) : (
          <button onClick={connectWallet}>Connect MetaMask</button>
        )}
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter a value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}  // Update inputValue state
        />
        <button onClick={setCipherText}>Set Value Cipertext Value</button>
        <div>
          <button onClick={addToyPlain}>plain test</button>
        </div>
      </div>
      <div>
        <button onClick={getSealOuput}>getSealOuput</button>
      </div>
    </div>
  );
}

export default App;
