import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { BigNumber, ethers } from "ethers";
import tokenABI from "../../utils/abi";
import classes from "./style.module.css";
import {
  Container,
  Group,
  Text,
  Stepper,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import TransactionContext from "../../context/transaction/TransactionContext";
import Utils from "utils/Utils";

import ProductContext from "../../context/products/ProductContext";
import AuthContext from "context/auth/AuthContext";
import DeliveryAddress from "components/DeliveryAddress";
import StepperOne from "./StepperOne";
import StepperCompleted from "./StepperCompleted";
import DeliveryPrice from "./DeliveryPrice";
import { Link } from "react-router-dom";

function Basket() {
  const [t, i18n] = useTranslation();
  const { addToast } = useToasts();
  const authContext = useContext(AuthContext);
  const productContext = useContext(ProductContext);
  const transactionContext = useContext(TransactionContext);
  const { address, isSigned } = authContext;
  const {
    selected_adress,
    postNewOrder,
    order_id,
    delivery_price,
    clearDeliveryPrice,
  } = transactionContext;
  const {
    basket,
    addProductToBasket,
    subtractProductFromBasket,
    removeProductFromBasket,
    clearBasket,
  } = productContext;

  const [payment, setPayment] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [active, setActive] = useState(0);
  const [radioTxt, setRadioTxt] = useState("");
  const [loadingApprove, setLoadingApprove] = useState(false);

  const nextStep = () => {
    if (Object.keys(radioTxt).length === 0 && active === 1) {
      Utils.toastHandler(
        addToast,
        t("please_select_delivery_address"),
        "error"
      );
    } else {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const makePaymentSWT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const _data = Utils.makeuid(70);
    console.log("dataaa: ", _data);
    const signer = provider.getSigner();

    const token = new ethers.Contract(
      process.env.REACT_APP_TOKEN_CONTRACT,
      tokenABI,
      signer
    );
    console.log("token ", token);
    setLoadingApprove(true);
    try {
      const token2 = new ethers.Contract(
        process.env.REACT_APP_DEPOSIT_CONTRACT,
        tokenABI,
        signer
      );
      console.log("token 5", token2);
      const transaction = await token2
        .deposit(
          process.env.REACT_APP_TOKEN_CONTRACT,
          ethers.utils.parseUnits(totalPrice.toString(), 18),
          _data
        )
        .then(async (res) => {
          console.log("resss ss :: ", res);
          res.wait().then((finalTx) => {
            setLoadingApprove(false);
            var items = [];
            for (var i = 0; i < basket.length; i++)
              items.push({
                RecTradeSubjectId: basket[i].RecID,
                RecAmount: basket[i].count,
                RecPrice: basket[i].RecPrice,
              });

            const newOrder = {
              city: selected_adress.city,
              RecLogisticInfo: selected_adress.address,

              receiver_fio: selected_adress.receiver_fio,
              bch_order_id: _data.toString(),
              receiver_number: selected_adress.receiver_number,
              country: "1",
              total_price: (Math.round(totalPrice * 100) / 100).toFixed(2),
              items: items,
            };
            console.log("newOrder: ", newOrder);
            postNewOrder(newOrder);
            nextStep();
            clearBasket();
          });
        })
        .catch((error) => {
          setLoadingApprove(false);
          console.log("error aprove", error);
          return error;
        });
    } catch (error) {
      setLoadingApprove(false);
      console.log("err 55", error);
    }
  };

  const checkAllowance = async () => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum);

    const signer = await provider.getSigner();

    const token = await new ethers.Contract(
      process.env.REACT_APP_TOKEN_CONTRACT,
      tokenABI,
      signer
    );
    try {
      const allowance = await token
        .allowance(address, process.env.REACT_APP_DEPOSIT_CONTRACT)
        .then((res) => {
          return ethers.utils.formatEther(BigNumber.from(res));
        })
        .catch((err) => console.log("err", err));
      return allowance;
    } catch (error) {
      console.log(error);
    }
  };

  const allowanceHandle = async () => {
    if (address.length > 1) {
      const allowance = await checkAllowance();
      if (
        parseFloat(allowance) >= parseFloat(totalPrice) ||
        parseFloat(allowance) == parseFloat(totalPrice)
      ) {
        await makePaymentSWT();
      } else {
        approve();
      }
    }
  };

  const approve = async () => {
    Utils.toastHandler(
      addToast,
      "Пожалуйста подтвердите что вы будете тратить вашы токены",
      "success"
    );
    setLoadingApprove(true);
    const appr = await Utils.approveHandle(totalPrice.toString())
      .then(async (res) => {
        setLoadingApprove(false);
        if (res?.code == undefined) {
          Utils.toastHandler(addToast, "Спасибо за подтверждение", "success");
          await allowanceHandle();
        } else {
          Utils.toastHandler(addToast, "Вы откланили вашы затраты", "success");
        }
      })
      .catch((error) => {
        setLoadingApprove(false);
        console.log("error aprove", error);
      });
  };

  const handleSubtractProduct = (item) => {
    if (item.count > 1) {
      subtractProductFromBasket(item);
    }
  };

  const totalPriceHandler = () => {
    let tprice = 0;
    let delprice = 0;
    basket.map((item) => (tprice = tprice + item.RecPrice * item.count));
    basket.map((item) => (delprice = item.RecWeight * item.count));

    setPayment(tprice.toString());
    setTotalPrice((tprice + delivery_price).toFixed(2));
  };

  useEffect(() => {
    totalPriceHandler();
    if (radioTxt === "") {
      clearDeliveryPrice();
    }
  }, [basket, delivery_price]);

  const handleTrash = (item) => {
    removeProductFromBasket(item);
  };

  return (
    <Container fluid>
      <div className={classes.medialower}>
        <Stepper
          iconSize={42}
          color="indigo"
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          allowNextStepsSelect={false}
        >
          <Stepper.Step label={t("basket")} description={t("check_your_cart")}>
            <StepperOne
              basket={basket}
              payment={payment}
              addProductToBasket={addProductToBasket}
              handleSubtractProduct={handleSubtractProduct}
              handleTrash={handleTrash}
              nextStep={nextStep}
            />
          </Stepper.Step>

          <Stepper.Step
            label={t("delivery")}
            description={t("fill_in_the_address")}
          >
            <DeliveryAddress
              radioTxt={radioTxt}
              handleRadiotext={(val) => setRadioTxt(val)}
              handleWalletAdress={() => console.log("handle wallet address")}
            />

            <DeliveryPrice />

            <Group position="center" mt="xl">
              <Button variant="default" onClick={prevStep}>
                {t("go_back")}
              </Button>
              <Button
                disabled={!isSigned}
                style={{ backgroundColor: "red" }}
                onClick={nextStep}
              >
                {t("next_step")}
              </Button>
            </Group>
          </Stepper.Step>

          <Stepper.Step label={t("payment")} description={t("please_pay")}>
            <LoadingOverlay visible={loadingApprove} overlayBlur={0} />
            <StepperCompleted
              totalPrice={totalPrice}
              prevStep={prevStep}
              makePaymentSWT={allowanceHandle}
            />
          </Stepper.Step>
          <Stepper.Completed>
            <Text mt={50} weight={"bold"} align="center" size={"xl"}>
              {t("thank_you_for_your_purchase")} <br />
              {t("your_order_status")}{" "}
              <div>
                <span style={{ color: "#4B6EF5" }}>№ {order_id}</span>{" "}
              </div>
              {t("can_be_tracked")}{" "}
              <Link to={"/profile"}>{t("personal_account")}</Link>.
            </Text>
          </Stepper.Completed>
        </Stepper>
      </div>
    </Container>
  );
}

export default Basket;

{
  /* const swtPay = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const token = new ethers.Contract(
    process.env.REACT_APP_TOKEN_CONTRACT,
    tokenABI,
    signer
  );

  try {
    await token.approve(
      process.env.REACT_APP_DEPOSIT_CONTRACT,
      web3.utils.toWei("1000000000", "Gwei")
    );

    const token2 = new ethers.Contract(
      process.env.REACT_APP_DEPOSIT_CONTRACT,
      tokenABI,
      signer
    );
    const transaction = await token2.deposit(
      process.env.REACT_APP_TOKEN_CONTRACT,
      web3.utils.toWei("10000000", "Gwei"),
      "DEPOTITE_ABI__AAA"
    );
    console.log("transaction:11", transaction);
  } catch (error) {
    console.log(error);
  }
};*/
}

/*
  const handleClick = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hash: "0x79e1930566f7ff9d52b036c8ec4ab3ea043bab001626c6173a370e7edb38d1df",
        type: 2,
        accessList: null,
        blockHash: null,
        blockNumber: null,
        transactionIndex: null,
        confirmations: 0,
        sender: "0x5A3eEf47D739F3543F8B78fcD8290EBE06358E36",
        gasPrice: {
          type: "BigNumber",
          hex: "0x0189640200",
        },
        maxPriorityFeePerGas: {
          type: "BigNumber",
          hex: "0x0189640200",
        },
        maxFeePerGas: {
          type: "BigNumber",
          hex: "0x0189640200",
        },
        gasLimit: {
          type: "BigNumber",
          hex: "0x03c4bb",
        },
        receiver: "0x649fd67394e3A3C1298Eec0Ce24175d4E6537409",
        value: {
          type: "BigNumber",
          hex: "0x00",
        },
        nonce: 171,
        data: "0xbfe07da60000000000000000000000001676a38cd7f819859c21165cda5663b39c73507a000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000464e7775736864766c3052476a3472693144354a524b615243664c6e76346b783373477849455471735934514f564b774b5a61435465455a7065676f4b3251333959615a4d66370000000000000000000000000000000000000000000000000000",
        r: "0x14cacdf27f2a8710b365eb309c2986996fb5269e7684e2dc7db6eafbe6fdc0e5",
        s: "0x4776960dc9679f7d890b63d2b5f09f615b06665c33521aaf2855941f6db2c238",
        v: 0,
        creates: null,
        chainId: 0,
      }),
    };
    fetcher(
      (response) => {
        console.log("response: ", response);
      },
      `${REACT_APP_BASE_URL}/ru/blockchain-transaction/create/`,
      requestOptions
    );
  };*/

/*  const handleSign = async (address) => {
    const { message, signature } = await Utils.getSignature(address);

    signin({
      address: address,
      message: message,
      signature: signature,
    });
  };

  console.log("walletAdress: ", walletAdress);
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (res) => {
          setWalletAdress(res[0]);
          !isSigned && handleSign(res[0]);
        })
        .catch((error) => {
          addToast(t('please_login_to_metamask'), { appearance: "error" });
        });
    }
  }, []);
*/
