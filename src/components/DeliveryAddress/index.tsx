import { useContext, useEffect, useState } from "react";
import { Button, Card, Group, Radio, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconPlus } from "@tabler/icons";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useToasts } from "react-toast-notifications";
import { useForm } from "@mantine/form";
import AuthContext from "context/auth/AuthContext";
import { ReactComponent as DotsIcon } from "assets/images/icons/DotsIcon.svg";
import TransactionContext from "../../context/transaction/TransactionContext";
import ProductContext from "../../context/products/ProductContext";
import H4Context from "../../context/h4/H4Context";
import AddAdressModal from "./AddAdressModal";
import DeleteAdressModal from "./DeleteAdressModal";
import EditAdressModal from "./EditAdressModal";
import Utils from "utils/Utils";
import EnterToMetamask from "components/EnterToMetamask";
import classes from "./style.module.css";
import DotsModal from "./DotsModal";

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
  /* { bsc: {
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
  },}*/
};

interface Props {
  radioTxt?: string;
  handleRadiotext?: any;
  handleWalletAdress?: any;
}

const DeliveryAddress = ({
  radioTxt,
  handleRadiotext,
  handleWalletAdress,
}: Props) => {
  const [t, i18n] = useTranslation();
  const { addToast } = useToasts();
  const transactionContext = useContext(TransactionContext);
  const h4Context = useContext(H4Context);
  const authContext = useContext(AuthContext);
  const productContext = useContext(ProductContext);

  const { basket } = productContext;
  const {
    getAddress,
    postAddress,
    editAddress,
    deleteAddress,
    addresses,
    postCalculateDeliveryAdress,
  } = transactionContext;
  const { getCountries, countryList } = h4Context;
  const { isSigned, signin, signOut, access_token } = authContext;
  const [dots, setDots] = useState<any>(undefined);
  const [dotsModal, setDotsModal] = useState<any>(undefined);
  const [dotsAdd, setDotsAdd] = useState({});
  const [openedAdd, setOpenedAdd] = useState(false);
  const [openedDelete, setOpenedDelete] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [metamaskUninstalled, setMetamaskUninstalled] = useState(false);
  const initialState = { accounts: [], balance: "", chainId: "" }; /* Updated */
  const [wallet, setWallet] = useState(initialState);
  const [error, setError] = useState();

  const form = useForm({
    initialValues: {
      country: "1",
      city: "",
      address: "",
      receiver_fio: "",
      receiver_number: "",
    },

    validate: {
      // country: (value) => (value?.length < 1 ? "Выберите страну" : null),
      city: (value) =>
        value.replace(/\D/g, "").length || value?.length < 3
          ? t("your_city")
          : null,
      receiver_fio: (value) =>
        value.replace(/\D/g, "").length || value?.length < 3
          ? t("receiver_fio")
          : null,
      receiver_number: (value) =>
        !/^[0-9\b]+$/.test(value) ? t("receiver_phone") : null,
      address: (value) => (value.length < 3 ? t("your_adress") : null),
    },
  });

  const handleShowDelete = (address: any) => {
    setOpenedDelete(true);
    form.setValues(address);
  };

  const handleShowEdit = (address: any) => {
    console.log("address ", address);
    const newValues = {
      id: address.id,
      country: address.country.id,
      city: address.city,
      address: address.address,
      is_active: address.is_active,
      receiver_fio: address.receiver_fio,
      receiver_number: address.receiver_number,
    };
    form.setValues(newValues);
    setOpenedEdit(true);
  };

  const onSubmit = () => {
    setOpenedAdd(false);
    postAddress(form.values);
  };

  const onSubmitDelete = (id: number) => {
    deleteAddress(id);
    setOpenedDelete(false);
    form.reset();
  };

  const onSubmitEdit = () => {
    editAddress(form.values);
    setOpenedEdit(false);
  };

  const handleAdresschange = (e: any) => {
    const { name, value } = e.target;
    form.setValues({ ...form.values, [name]: value });
  };

  const getCountryOptions = (countryList: any) => {
    if (!countryList) {
      return [];
    }

    let out = countryList.map((c: any) => {
      return {
        value: c.id,
        label:
          i18n.language == "en"
            ? c.name_en
            : i18n.language == "ru"
            ? c.name_ru
            : c.name_zh_hans,
      };
    });
    return out;
  };

  const handleSign = async (address: any) => {
    const { message, signature } = await Utils.getSignature();

    signin({
      address: address,
      message: message,
      signature: signature,
    });
  };

  const handleRadioButton = (adresses: any) => {
    console.log("basket: ", basket);

    var items = [];
    for (var i = 0; i < basket.length; i++)
      items.push({
        RecTradeSubjectId: basket[i].RecID,
        RecAmount: basket[i].count,
      });
    postCalculateDeliveryAdress(adresses, { items });
  };
  /*
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = { accounts: [], balance: "", chainId: "" };  
  const [wallet, setWallet] = useState(initialState);
  const [error, setError] = useState();

  const formatChainAsNum = (chainIdHex: string) => {
    const chainIdNum = parseInt(chainIdHex);
    return chainIdNum;
  };

  const handleNetworkSwitch = async (networkName: any) => {
    await changeNetwork({ networkName });
  };

  useEffect(() => {
    const refreshChain = (chainId: any) => {
      console.log("ggg: ", chainId);

      const chain = formatChainAsNum(chainId);

      if (chain != 97) {
        handleNetworkSwitch("bsc");
      }
      // setWallet((wallet) => ({ ...wallet, chainId }));  
    };  

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log("provider: ", provider);

      setHasProvider(Boolean(provider));

      if (provider) {
        // @ts-ignore
        const chainId = await window.ethereum!.request({
          method: "eth_chainId",
        });
        refreshChain(chainId);

        // @ts-ignore
        window.ethereum.on("chainChanged", refreshChain);  
      }
    };

    getProvider();

    return () => {
      // @ts-ignore
      window.ethereum?.removeListener("chainChanged", refreshChain);  
    };
  }, []);

  console.log("wallet: ", wallet);
  console.log("isSigned: ", isSigned);

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
    } catch (err) {
      // @ts-ignore
      console.log(err.message);
    }
  };
*/

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
        if (!isSigned) {
          const { message, signature } = await Utils.getSignature();
          signin({
            address: res[0],
            message: message,
            signature: signature,
          });
        }
        updateWallet([res[0]]);
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

    // @ts-ignore
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    });

    const chain = formatChainAsNum(chainId);

    if (chain != 97) {
      handleNetworkSwitch("bsc");
      setWallet({ accounts, balance, chainId: chain.toString() });
    } else {
      // handleSignAccount(accounts[0]);
      setWallet({ accounts, balance, chainId: chain.toString() });
    }
  };

  useEffect(() => {
    const refreshAccounts = async (accounts: any) => {
      if (accounts.length > 0) {
        /*    // @ts-ignore
        const chainId = await window.ethereum!.request({
          method: "eth_chainId",
        });
        const chain = formatChainAsNum(chainId);
        console.log("wallet.accounts 11", accounts[0]);
        console.log("wallet.accounts 11", wallet.accounts[0]);

        if (chain === 97 && wallet.accounts[0] == undefined) {
          const { message, signature } = await Utils.getSignature();

          await signin({
            address: accounts[0],
            message: message,
            signature: signature,
          });
        }
*/
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

        //window.location.reload(false);
        // window.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    getAddress();
    getCountries();
    handleWalletAdress(wallet.accounts[0]);
  }, [access_token]);

  const handleSignAccount = async (walletAccount: any) => {
    if (isSigned) {
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log("999999 333", accounts[0]);

      // @ts-ignore
      const chainId = await window.ethereum!.request({
        method: "eth_chainId",
      });
      const chain = formatChainAsNum(chainId);

      console.log("55555 333", walletAccount);
      console.log("55555 111", wallet.accounts.length);

      if (chain === 97 && wallet.accounts.length == 2) {
        const { message, signature } = await Utils.getSignature();

        await signin({
          address: accounts[0],
          message: message,
          signature: signature,
        });
      }
    }
  };

  useEffect(() => {
    handleSignAccount(wallet.accounts[0]);
  }, [wallet.accounts[0]]);

  return (
    <>
      {isSigned ? (
        <>
          <Card
            style={{ marginTop: 20 }}
            shadow="sm"
            p="lg"
            radius="lg"
            withBorder
          >
            <Text weight={600} size="xl">
              {t("delivery_address")}
            </Text>
            {addresses.map((add: any, idx: number) => {
              return (
                <>
                  <div className={classes.delivery_wrapper}>
                    <Radio.Group
                      value={radioTxt}
                      onChange={(event) => {
                        handleRadioButton(add);
                        handleRadiotext(event);
                      }}
                      name="address"
                    >
                      <Radio
                        className={classes.radio}
                        value={`${add.city}, ${add.address}`}
                        label={`${add.city}, ${add.address}`}
                      />
                    </Radio.Group>

                    <span
                      onClick={() => {
                        setDotsModal(true);
                        setDotsAdd(add);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <DotsIcon />
                    </span>
                    {dots === idx && (
                      <div className={classes.dots_wrapper}>
                        <Button
                          onClick={() => handleShowEdit(add)}
                          className={classes.edit_btn}
                        >
                          {t("edit")}
                        </Button>
                        <Button
                          color="red"
                          onClick={() => handleShowDelete(add)}
                          className={classes.delete_btn}
                        >
                          {t("delete")}
                        </Button>
                      </div>
                    )}
                  </div>
                  <hr style={{ height: "1px", marginTop: "2px" }} />
                </>
              );
            })}

            <div className={classes.add_adress_wrapper}>
              <Button
                onClick={() => setOpenedAdd(true)}
                leftIcon={<IconPlus />}
                variant="subtle"
              >
                {t("add_adress")}
              </Button>
            </div>
          </Card>

          <div style={{ paddingTop: 20 }}></div>
        </>
      ) : (
        <EnterToMetamask metamaskUninstalled={metamaskUninstalled} />
      )}

      <DotsModal
        add={dotsAdd}
        dotsModal={dotsModal}
        t={t}
        handleShowEdit={(val: any) => {
          handleShowEdit(val);
          setDotsModal(false);
        }}
        handleShowDelete={(val: any) => {
          handleShowDelete(val);
          setDotsModal(false);
        }}
        handleOpened={() => setDotsModal(false)}
        countries={getCountryOptions(countryList)}
        onSubmit={onSubmit}
      />

      <AddAdressModal
        opened={openedAdd}
        form={form}
        t={t}
        handleAdresschange={handleAdresschange}
        handleOpened={() => setOpenedAdd(false)}
        countries={getCountryOptions(countryList)}
        onSubmit={onSubmit}
      />

      <DeleteAdressModal
        visible={openedDelete}
        deleteAdress={form.values}
        handleOpened={(val: boolean) => setOpenedDelete(val)}
        onSubmitDelete={onSubmitDelete}
      />

      <EditAdressModal
        t={t}
        opened={openedEdit}
        form={form}
        handleAdresschange={handleAdresschange}
        onSubmit={onSubmitEdit}
        countries={getCountryOptions(countryList)}
        handleOpened={() => setOpenedEdit(false)}
      />
    </>
  );
};

export default DeliveryAddress;
