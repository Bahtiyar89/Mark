import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Group, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import AuthContext from "context/auth/AuthContext";

const networks = {
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
  /* bsc: {
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

const StepperCompleted = ({ makePaymentSWT, totalPrice, prevStep }: any) => {
  const [t, i18n] = useTranslation();
  const authContext = useContext(AuthContext);
  const { metamaskChainId } = authContext;
  const { addToast } = useToasts();
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = { accounts: [], balance: "", chainId: "" }; /* Updated */
  const [wallet, setWallet] = useState(initialState);
  const [error, setError] = useState();

  const changeNetwork = async ({ networkName }: any) => {
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
      makePaymentSWT();
    } catch (err) {
      // @ts-ignore
      console.log(err.message);
    }
  };

  const handleNetworkSwitch = async (networkName: any) => {
    if (metamaskChainId != 56) {
      await changeNetwork({ networkName });
    }
  };

  return (
    <>
      <p style={{ paddingTop: 100, textAlign: "center", fontSize: 32 }}>
        <span style={{ fontSize: 25 }}>{t("total_amount")}:</span> {totalPrice}{" "}
        USD
      </p>
      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          {t("go_back")}
        </Button>
        <Button bg={"red"} onClick={() => handleNetworkSwitch("bsc")}>
          {t("pay")}
        </Button>
      </Group>
    </>
  );
};

export default StepperCompleted;
