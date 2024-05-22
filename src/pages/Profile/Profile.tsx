import { useEffect, useRef, useContext, useState } from "react";
import { Card, Container, Grid, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useToasts } from "react-toast-notifications";
import Web3 from "web3";

import "react-spring-bottom-sheet/dist/style.css";
import BreadCrumb from "containers/BreadCrumb";
import TransactionContext from "../../context/transaction/TransactionContext";
import depositAbi from "utils/depositAbi";
import classes from "./style.module.css";
import tokenABI from "utils/abi";
import AuthContext from "context/auth/AuthContext";
import Utils from "utils/Utils";
import DeliveryAddress from "components/DeliveryAddress";
import AccordionComp from "./AccordionComponent";
import EnterToMetamask from "components/EnterToMetamask";
import moment from "moment";
import networksBSC from "utils/networksBSC";

const { REACT_APP_BASE_URL, REACT_APP_TOKEN_CONTRACT } = process.env;

const web3 = new Web3(
  new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/")
);

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
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://bsc-dataseed.binance.org/",
      "https://bsc-dataseed2.defibit.io/",
    ],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  /*  bsc: {
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
  },*/
};

function Profile() {
  const [t, i18n] = useTranslation();
  const transactionContext = useContext(TransactionContext);
  const authContext = useContext(AuthContext);
  const { isSigned, signin, signOut, access_token } = authContext;
  const {
    allOrders,
    loading_order,
    orderDetails,
    getOrderDetails,
    getAllOrders,
    cancelOrder,
  } = transactionContext;

  const { addToast } = useToasts();

  const [usdtBalance, setUsdtBalance] = useState<any>("");
  const [showControl, setShowControl] = useState({ RecID: 0, show: false });
  const [orders, setOrders] = useState([]);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<any>(null);
  const initialState = { accounts: [], balance: "", chainId: "" }; /* Updated */
  const [wallet, setWallet] = useState(initialState);
  const [error, setError] = useState();
  const [radioTxt, setRadioTxt] = useState("");

  const handleStartTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer((num) => num + 1);

      console.log(moment().diff(allOrders[0]?.RecDTCreate, "minutes"));
      if (moment().diff(allOrders[0]?.RecDTCreate, "minutes") < 6) {
        getAllOrders();
      } else {
        clearTimer();
      }
    }, 300000);
  };

  const clearTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(0);
  };

  const USDbalance = async (address: string) => {
    const contract = new web3.eth.Contract(tokenABI, REACT_APP_TOKEN_CONTRACT);
    // @ts-ignore
    const usdt = await contract.methods.balanceOf(address).call();
    // @ts-ignore
    setUsdtBalance(web3.utils.fromWei(usdt, "ether"));
  };

  const formatBalance = (rawBalance: string) => {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
    return balance;
  };

  const formatChainAsNum = (chainIdHex: string) => {
    const chainIdNum = parseInt(chainIdHex);
    return chainIdNum;
  };

  const handleConnect = async () => {
    // @ts-ignore
    await window.ethereum
      ?.request({
        method: "eth_requestAccounts",
      })
      .then(async (res) => {
        updateWallet(res);
        if (!isSigned) {
          const { message, signature } = await Utils.getSignature();
          signin({
            address: res[0],
            message: message,
            signature: signature,
          });
        }
      })
      .catch((err) => console.log("ss"));
  };

  // @ts-ignore
  const changeNetwork = async ({ networkName, setError }) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      // @ts-ignore
      await window.ethereum
        ?.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              // @ts-ignore
              ...networks[networkName],
            },
          ],
        })
        .then((res) => console.log("resp:: ", res));
    } catch (err) {
      // @ts-ignore
      setError(err.message);
    }
  };

  const handleNetworkSwitch = async (networkName: any) => {
    // @ts-ignore
    const met = await window.ethereum?._metamask?.isUnlocked();
    console.log("networkName: 55", met);
    // @ts-ignore
    setError();
    await changeNetwork({ networkName, setError });
  };

  const updateWallet = async (accounts: any) => {
    // @ts-ignore
    const balance = formatBalance(
      // @ts-ignore
      await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    USDbalance(accounts[0]);

    // @ts-ignore
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    });

    const chain = formatChainAsNum(chainId);
    console.log("chain::: 33", chain);
    console.log("accounts::: 33", accounts);
    console.log("wallet::: 33", wallet);
    console.log("accounts[0]", accounts[0]);
    console.log("wallet[0]", wallet.accounts[0]);
    if (chain != 56) {
      handleNetworkSwitch("bsc");
      setWallet({ accounts, balance, chainId: chain.toString() });
    } else {
      setWallet({ accounts, balance, chainId: chain.toString() });
    }
    getAllOrders();
  };

  useEffect(() => {
    const refreshAccounts = async (accounts: any) => {
      if (accounts.length > 0) {
        // @ts-ignore
        const chainId = await window.ethereum!.request({
          method: "eth_chainId",
        });
        const chain = formatChainAsNum(chainId);
        console.log("wallet.accounts 11", accounts[0]);
        console.log("wallet.accounts 11", wallet.accounts[0]);

        if (chain === 56) {
          /*  const { message, signature } = await Utils.getSignature();
          console.log("message 55", message);
          console.log("signature 55", signature);
          console.log("accounts[0] 55", accounts[0]);

          await signin({
            address: accounts[0],
            message: message,
            signature: signature,
          });*/
        }

        updateWallet(accounts);
      } else {
        // if length 0, user is disconnected
        signOut();
        console.log("ourrrtt");

        setWallet(initialState);
      }
    };

    const refreshChain = async (chainId: any) => {
      const chain = formatChainAsNum(chainId);
      console.log("reddd:", chain);
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      refreshAccounts(accounts);
      setWallet((wallet) => ({ ...wallet, chainId: chain.toString() }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      // setHasProvider(Boolean(provider));

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

  useEffect(() => {
    handleConnect();
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
        console.log("tttTTT:");
        // @ts-ignore
        window.location.reload(false);
        // window.location.reload();
      });
    }
  });

  useEffect(() => {
    for (var i = 0; i < allOrders.length; i++) {
      if (
        moment().diff(allOrders[i]?.RecDTCreate, "minutes") < 5 &&
        allOrders[i]?.payment_status === "not paid"
      ) {
        allOrders[i].payment_status = "processing";
        handleStartTimer();
      }
    }

    setOrders(allOrders);

    return function cleanup() {
      clearTimer();
    };
  }, [allOrders]);

  useEffect(() => {
    getAllOrders();
    return function cleanup() {
      clearTimer();
    };
  }, [access_token]);

  const handleOrderShow = (RecID: number) => {
    if (showControl.RecID === RecID) {
      setShowControl({ ...showControl, show: !showControl.show });
    } else {
      getOrderDetails(RecID);
      setShowControl({ RecID: RecID, show: true });
    }
  };

  const handleChain = () => {
    if (wallet.chainId === "56") {
      return "BSC MAINNET";
    } else if (wallet.chainId === "97") {
      return "BSC TESTNET";
    } else if (wallet.chainId === "1") {
      return "Ethereum";
    } else if (wallet.chainId === "59144") {
      return "Linea";
    } else {
      return "BSC";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.accounts[0]);
    addToast(t("successfully_copied"), {
      appearance: "success",
    });
  };
  console.log("https://bsc-dataseed.binance.org/", wallet);

  return (
    <Container pb={100} fluid>
      <div className={classes.medialower}>
        {isSigned ? (
          <>
            <BreadCrumb />
            <Grid style={{ paddingTop: 50 }}>
              <Grid.Col xs={12} sm={12} md={6} lg={4} xl={4}>
                <Card shadow="sm" p="lg" radius="lg" withBorder>
                  <Text size="xl">{t("profile")}</Text>
                  <Text mt={20} size="xs" color="dimmed">
                    {t("adress")} {handleChain()}
                  </Text>
                  <Text size="sm">{wallet.accounts[0]}</Text>
                  <Text
                    onClick={handleCopy}
                    className={classes.copy}
                    size="xs"
                    color="red"
                  >
                    {t("copy")}
                  </Text>
                  <Grid style={{ paddingTop: 50 }}>
                    <Grid.Col xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Text weight={500}>{t("balance")} BNB</Text>
                      <Text weight={500}>
                        {/*parseFloat(bnbBalance).toFixed(2)*/ wallet.balance}{" "}
                        BNB
                      </Text>
                    </Grid.Col>
                    <Grid.Col xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Text weight={500}>{t("balance")} USD</Text>
                      <Text weight={500}>
                        {usdtBalance == 0
                          ? "0.00"
                          : parseFloat(usdtBalance).toFixed(2)}{" "}
                        USD
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Card>
                <DeliveryAddress
                  radioTxt={radioTxt}
                  handleWalletAdress={(val: any) => console.log("cc", val)}
                  handleRadiotext={(val: any) => setRadioTxt(val)}
                />
              </Grid.Col>
              <Grid.Col xs={12} sm={12} md={6} lg={8} xl={8}>
                <Card shadow="sm" p="lg" radius="lg" withBorder>
                  <Text size="xl">{t("mypurchases")}</Text>

                  {allOrders.length > 0 ? (
                    orders.map((item: any) => {
                      return (
                        <AccordionComp
                          handleShowDetails={(id: any) => console.log("dd")}
                          handleShowOrder={handleOrderShow}
                          orderDetails={orderDetails}
                          cancelOrder={cancelOrder}
                          showControl={showControl}
                          loading_order={loading_order}
                          {...item}
                        />
                      );
                    })
                  ) : (
                    <p style={{ color: "red" }}>
                      {t("you_have_no_orders_yet")}
                    </p>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <>
            <EnterToMetamask connectMetamask={handleConnect} />
          </>
        )}
      </div>
    </Container>
  );
}

export default Profile;

/*
  useEffect(() => {
    const refreshAccounts = async (accounts: any) => {
      if (accounts.length > 0) {
        if (!isSigned) {
          const { message, signature } = await Utils.getSignature();
          signin({
            address: accounts[0],
            message: message,
            signature: signature,
          });
        }

        updateWallet(accounts);
      } else {
        // if length 0, user is disconnected
        setWallet(initialState);
        signOut();
      }
    };

    const refreshChain = (chainId: any) => {
      console.log("chainId: 222", chainId);

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
         method: "eth_getBalance"  
        params: [accounts[0], "latest"]  
      })
    );
    // @ts-ignore                         
    const chainId = await window.ethereum!.request({
        method: "eth_chainId"  
    }); 

    console.log("accounts ", accounts);
    USDbalance(accounts[0]);
    setWallet({ accounts, balance, chainId });  
  };

  const handleConnect = async () => {
    // @ts-ignore
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);
  };

  const USDbalance = async (address: string) => {
    //decimals
    const balance = await web3.eth.getBalance(address);

    setBnbBalance(web3.utils.fromWei(balance, "ether"));
    const contractUsdt = new web3.eth.Contract(
      tokenABI,
      "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd"
    );
    const contractSwt = new web3.eth.Contract(
      tokenABI,
      "0x1676a38Cd7f819859c21165cDa5663b39c73507A"
    );

    //0x337610d27c682e347c9cd60bd4b3b107c9d34ddd usdt contract
    //0x1676a38Cd7f819859c21165cDa5663b39c73507A swt contract

    // @ts-ignore
    const usdt = await contractUsdt.methods.balanceOf(address).call();

    // @ts-ignore
    const swt = await contractSwt.methods.balanceOf(address).call();

    //0x5A3eEf47D739F3543F8B78fcD8290EBE06358E36 wallet address
    // @ts-ignore
    setUsdtBalance(web3.utils.fromWei(usdt, "ether"));
    // @ts-ignore
    setSwtBalance(web3.utils.fromWei(swt, "ether"));
  };

  useEffect(() => {
    for (var i = 0; i < allOrders.length; i++) {
      if (
        moment().diff(allOrders[i]?.RecDTCreate, "minutes") < 5 &&
        allOrders[i]?.payment_status === "not paid"
      ) {
        allOrders[i].payment_status = "processing";
        handleStartTimer();
      }
    }

    setOrders(allOrders);

    return function cleanup() {
      clearTimer();
    };
  }, [allOrders]);

  const handleStartTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer((num) => num + 1);

      console.log(moment().diff(allOrders[0]?.RecDTCreate, "minutes"));
      if (moment().diff(allOrders[0]?.RecDTCreate, "minutes") < 6) {
        getAllOrders();
      } else {
        clearTimer();
      }
    }, 300000);
  };

  const clearTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(0);
  };

  console.log("isSigned: ", isSigned);

 
  const handleAccount = (ethereum: any) => async () => {
    const isLocked = !(await ethereum._metamask.isUnlocked());

    if (isLocked) {
      reload();
    }
  };

  const setListener = (ethereum: any) => {
    ethereum.on("chainChanged", reload);
    ethereum.on("accountsChanged", handleAccount(ethereum));
  };
  const removeListener = (ethereum: any) => {
    ethereum.removeListener("chainChanged", reload);
    ethereum.removeListener("accountsChanged", handleAccount(ethereum));
  };

  const pullbalance = async (address: any) => {
    //decimals
    const balance = await web3.eth.getBalance(address);

    setBnbBalance(web3.utils.fromWei(balance, "ether"));
    const contractUsdt = new web3.eth.Contract(
      tokenABI,
      "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd"
    );
    const contractSwt = new web3.eth.Contract(
      tokenABI,
      "0x1676a38Cd7f819859c21165cDa5663b39c73507A"
    );

    //0x337610d27c682e347c9cd60bd4b3b107c9d34ddd usdt contract
    //0x1676a38Cd7f819859c21165cDa5663b39c73507A swt contract

    // @ts-ignore
    const usdt = await contractUsdt.methods.balanceOf(address).call();

    // @ts-ignore
    const swt = await contractSwt.methods.balanceOf(address).call();

    //0x5A3eEf47D739F3543F8B78fcD8290EBE06358E36 wallet address
    // @ts-ignore
    setUsdtBalance(web3.utils.fromWei(usdt, "ether"));
    // @ts-ignore
    setSwtBalance(web3.utils.fromWei(swt, "ether"));
  };

  const handleSign = async (address: string) => {
    const { message, signature } = await Utils.getSignature();

    signin({
      address: address,
      message: message,
      signature: signature,
    });
  };



  const handleStopTimer = () => {
    clearInterval(intervalRef.current);
  };

  



  useEffect(() => {
    getAllOrders();
    return function cleanup() {
      clearTimer();
    };
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request?.({ method: "eth_requestAccounts" })
        .then(async (res) => {
          console.log("res[0]: ", res[0]);

          setWalletAdress(res[0]);
          pullbalance(res[0]);
          //  history();
          !isSigned && handleSign(res[0]);
          getAddress();
        })

        .catch((error) => {
          addToast(t("please_login_to_metamask"), { appearance: "error" });
        });

      setListener(window.ethereum);
      removeListener(window.ethereum);
    }

    return function cleanup() {
      console.log("CLEAN");

      clearInterval(timer);
    };
  }, [window.ethereum]); 
  
  console.log("222", moment().diff(allOrders[0]?.RecDTCreate, "minutes"));
 
  console.log("wallet: ", wallet);

  useEffect(() => {
    console.log("111", wallet.accounts.length);

    if (isSigned && wallet.accounts.length > 0) {
      getAllOrders();
    }
  }, [isSigned, wallet]);


  const [data, setdata] = useState({
    address: "",
    balance: null,
  });
  const [balance, setBalance] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  // Button handler button for handling a
  // request event for metamask
  const btnhandler = async () => {
    // res[0] for fetching a first wallet
    handleNetworkSwitch("bsc");
    // @ts-ignore
    window.ethereum
      ?.request({ method: "eth_requestAccounts" })
      .then((res) => accountChangeHandler(res[0]))
      .catch((err) => console.log("ss"));
  };

  // getbalance function for getting a balance in
  // a right format with help of ethers
  // @ts-ignore
  const getbalance = (address) => {
    // Requesting balance method
    // @ts-ignore
    window.ethereum
      ?.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      .then((balance) => {
        // Setting balance
        // @ts-ignore
        setdata({ Balance: ethers.utils.formatEther(balance) });
      });
  };

  // Function for getting handling all events
  const accountChangeHandler = (account: any) => {
    // Setting an address data

    console.log("account: ", account);
    // @ts-ignore
    setdata({
      address: account,
    });

    // Setting a balance
    getbalance(account);
  };

  const [error, setError] = useState();

  const handleNetworkSwitch = async (networkName: any) => {
    // @ts-ignore
    const met = await window.ethereum?._metamask?.isUnlocked();
    console.log("networkName:", met);
    // @ts-ignore
    setError();
    // @ts-ignore
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



  useEffect(() => {
    btnhandler();
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      // @ts-ignore
      window.ethereum
        ?.request({ method: "eth_requestAccounts" })
        .then((res) => setWalletAdress(res[0]))
        .catch((err) => console.log("ss"));
    } else {
      alert("Установите метамаск!!");
    }
  }, []);

  const pullbalance = async () => {
    if (walletAdress) {
      const balance = await web3.eth.getBalance(walletAdress);
      setBalance(web3.utils.fromWei(balance, "ether"));
    }

    const token = await web3.eth.getBalance(
      "0x1676a38Cd7f819859c21165cDa5663b39c73507A"
    );
    // @ts-ignore
    setContractAddress(token);
    // @ts-ignore
    const currentChainId = await window.ethereum.request({
      method: "net_version",
    });

    const contract = new web3.eth.Contract(
      tokenABI,
      "0x1676a38Cd7f819859c21165cDa5663b39c73507A"
    );
    //0x1676a38Cd7f819859c21165cDa5663b39c73507A
    // @ts-ignore
    const swt = await contract.methods // @ts-ignore
      .balanceOf("0x5A3eEf47D739F3543F8B78fcD8290EBE06358E36")
      .call();
    //0x5A3eEf47D739F3543F8B78fcD8290EBE06358E36
    // @ts-ignore
    setSwtBalance(web3.utils.fromWei(swt, "ether"));

    console.log("pp", web3.currentProvider);
  };

  console.log("data: ", data);
*/
