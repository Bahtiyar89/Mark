import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { useToasts } from "react-toast-notifications";
import { IconUser } from "@tabler/icons";
import MainRoutes from "routers";

import "react-input-range/lib/css/index.css";
import { useRouteLoaderData } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./App.css";

const steps = [
  {
    id: "0",
    message: "Добро пожаловать",
    trigger: "Ask Name",
  },
  {
    id: "Ask Name",
    message: "Пожалуйста введите свое имя",
    trigger: "waiting1",
  },
  {
    id: "waiting1",
    user: true,
    trigger: "Name",
  },
  {
    id: "Name",
    message: "Привет {previousValue}, Чем могу помочь ?",
    trigger: "issues",
  },
  {
    id: "issues",
    options: [
      { value: "work", label: "как работает сайт?", trigger: "work" },
      { value: "onother", label: "другой вопрос?", trigger: "onother" },
    ],
    trigger: "issues",
  },
  {
    id: "work",
    message: "Спасибо за вопрос нам о работе сайта",
    end: true,
  },
  {
    id: "onother",
    message: "У вас другой вопрос",
    end: true,
  },
];

function App() {
  const { addToast } = useToasts();
  const [t, i18n] = useTranslation();
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = { accounts: [], balance: "", chainId: "" }; /* Updated */
  const [wallet, setWallet] = useState(initialState);
  const [error, setError] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);

  /*
  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        addToast("Вы успешно вышли из метамаска", {
          appearance: "success",
        });

        // if length 0, user is disconnected
        setWallet(initialState);
      }
    };

    const refreshChain = (chainId: any) => {
      addToast("Вы изменили чаин для оплаты нужен BSC", {
        appearance: "success",
      });
      setWallet((wallet) => ({ ...wallet, chainId }));  
    }; 

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        // @ts-ignore
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        // @ts-ignore
        window.ethereum.on("accountsChanged", refreshAccounts);
        // @ts-ignore
        window.ethereum.on("chainChanged", refreshChain);  
      } else {
        addToast("Пожалуйста установите метамаск для покупок", {
          appearance: "error",
        });
      }
    };

    getProvider();

    return () => {
      // @ts-ignore
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      // @ts-ignore
      window.ethereum?.removeListener("chainChanged", refreshChain);  
    };
  }, []);

  const formatBalance = (rawBalance: string) => {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
    return balance;
  };

  const formatChainAsNum = (chainIdHex: string) => {
    const chainIdNum = parseInt(chainIdHex);
    return chainIdNum;
  };

  const updateWallet = async (accounts: any) => {
    // @ts-ignore
    const balance = formatBalance(
      // @ts-ignore
      await window.ethereum!.request({
          method: "eth_getBalance" , 
        params: [accounts[0], "latest"]  ,
      })
    );
    // @ts-ignore                         
    const chainId = await window.ethereum!.request({
       method: "eth_chainId"  ,
    });  
    setWallet({ accounts, balance, chainId });  
  };

  const handleConnect = async () => {
    // @ts-ignore
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);
  };

  useEffect(() => {
    let injectedProvider = false;

    if (typeof window.ethereum !== "undefined") {
      injectedProvider = true;
      console.log(window.ethereum);
    }

    console.log("wallet::: 2", wallet);
    // @ts-ignore
  }, []);

  console.log("wallet: ", wallet);
  const networks = {
    polygon: {
      chainId: `0x${Number(137).toString(16)}`,
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polygonscan.com/"],
    },
    bsc: {
      chainId: `0x${Number(97).toString(16)}`,
      chainName: "Binance Smart Chain Testnet",
      nativeCurrency: {
        name: "Binance Chain Native Token",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: [
        "https://data-seed-prebsc-1-s1.binance.org:8545/",
        "https://data-seed-prebsc-2-s1.binance.org:8545/",
        "http://data-seed-prebsc-1-s2.binance.org:8545/",
        "http://data-seed-prebsc-1-s2.binance.org:8545/",
        "http://data-seed-prebsc-2-s2.binance.org:8545/",
        "https://data-seed-prebsc-1-s3.binance.org:8545/",
        "https://data-seed-prebsc-2-s3.binance.org:8545/",
        "wss://bsc-ws-node.nariox.org",
      ],
      blockExplorerUrls: ["https://bscscan.com"],
    },
  };

  // Function for getting handling all events
  const accountChangeHandler = (account: any) => {};
  // Button handler button for handling a
  // request event for metamask
  const btnhandler = async () => {
    setIsOpen(true);
    // res[0] for fetching a first wallet
    // @ts-ignore
    window.ethereum
      ?.request({ method: "eth_requestAccounts" })
      .then((res) => accountChangeHandler(res[0]));
  };

  const changeNetwork = async ({ networkName, setError }: any) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      // @ts-ignore
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            // @ts-ignore
            ...networks[networkName],
          },
        ],
      });
    } catch (err) {
      // @ts-ignore
      setError(err.message);
    }
  };

  const handleNetworkSwitch = async (networkName: any) => {
    // @ts-ignore
    const met = await window.ethereum?._metamask?.isUnlocked();
    console.log("networkName:", met);
    // @ts-ignore
    setError();
    await changeNetwork({ networkName, setError });
  };

  const networkChanged = (chainId: any) => {
    console.log({ chainId });
  };

  useEffect(() => {
    // @ts-ignore
    window.ethereum?.on("chainChanged", networkChanged);

    return () => {
      // @ts-ignore
      window.ethereum?.removeListener("chainChanged", networkChanged);
    };
  }, []);

  // Detect change in Metamask account
  useEffect(() => {
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum.on("chainChanged", () => {
        //   window.location.reload();
      });
      // @ts-ignore
      window.ethereum.on("accountsChanged", () => {
        // window.location.reload();
      });
    }
  });
*/

  return (
    <div className="app">
      {/* <button onClick={() => handleNetworkSwitch("bsc")}>
        Connect MetaMask
      </button>*/}

      <MainRoutes />
    </div>
  );
}

export default App;
