import React, { useState, useEffect, createContext, useContext } from "react";
import { ethers } from "ethers";

import { contractAddress, contractAbi } from "../utils/constants";

const TransactionContext = createContext();

export const useTransactionContext = () => useContext(TransactionContext);

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );
  return transactionContract;
};

const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
const [transactions, setTransactions] = useState([]);
const handleChangeInput = (e, name) => {
  setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
};

const getAllTransaction = async () => {
  try {
    if (!ethereum) return alert("Please install metamask");
    const transactionContract = getEthereumContract();
    const availableTransactions =
      await transactionContract.getAllTransactions();
    const structuredTransaction = availableTransactions.map((transaction) => ({
      addressTo: transaction.reciever,
      addressFrom: transaction.sender,
      timestamp: new Date(
        transaction.timestamp.toNumber() * 1000
      ).toLocaleString(),
      message: transaction.message,
      keyword: transaction.keyword,
      amount: parseInt(transaction.amount._hex) / 10 ** 18,
    }));
    setTransactions(structuredTransaction);
  } catch (error) {
    console.log(error);
    throw new Error("No Ethereum Object");
  }
};

const checkIfWalletIsConnected = async () => {
  try {
    if (!ethereum) return alert("Please install metamask");
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      getAllTransaction();
    } else console.log("No accounts found");
  } catch (error) {
    console.log(error);
    throw new Error("No Ethereum Object");
  }
};

const checkIfTransactionExist = async () => {
  try {
    const transactionContract = getEthereumContract();
    const TransactionCount = await transactionContract.getTransactionCount();
    window.localStorage.setItem("transactionCount", TransactionCount);
  } catch (error) {
    console.log(error);
    throw new Error("No Ethereum Object");
  }
};

const connectWallet = async () => {
  try {
    if (!ethereum) return alert("Please install metamask");
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts);
  } catch (error) {
    console.log(error);
    throw new Error("No Ethereum Object");
  }
};

const sendTransaction = async () => {
  try {
    if (!ethereum) return alert("Please install metamask");

    //Get dafa from form
    const { addressTo, amount, keyword, message } = formData;
    const parsedAmount = ethers.utils.parseEther(amount);
    const transactionContract = getEthereumContract();
    await ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: currentAccount,
          to: addressTo,
          gas: "0x5208", //hex decimal 21000 gwei ===  0.000021eth
          value: parsedAmount._hex,
        },
      ],
    });

    const transactionHash = await transactionContract.addToBlockchain(
      addressTo,
      parsedAmount,
      message,
      keyword
    );

    setIsLoading(true);
    console.log(`Loading ~ ${transactionHash.hash}`);
    await transactionHash.wait();
    setIsLoading(false);
    console.log(`Success ~ ${transactionHash.hash}`);

    const TransactionCount = await transactionContract.getTransactionCount();
    setTransactionCount(TransactionCount.toNumber());
  } catch (error) {
    console.log(error);
    throw new Error("No Ethereum Object");
  }
};

useEffect(() => {
  checkIfWalletIsConnected();
  checkIfTransactionExist();
}, []);

return (
  <TransactionContext.Provider
    value={{
      connectWallet,
      currentAccount,
      formData,
      handleChangeInput,
      setFormData,
      sendTransaction,
      transactionCount,
      isLoading,
      transactions,
    }}
  >
    {children}
  </TransactionContext.Provider>
);
};

export default TransactionProvider;
