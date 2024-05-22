import { ethers } from "ethers";
import tokenABI from "./abi";

const makeuid = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const approveHandle = async (payment) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const token = new ethers.Contract(
      process.env.REACT_APP_TOKEN_CONTRACT,
      tokenABI,
      signer
    );
    return await token
      .approve(
        process.env.REACT_APP_DEPOSIT_CONTRACT,
        ethers.utils.parseUnits(payment, 18)
      )
      .then(async (res) =>
        res.wait().then((finalTx) => {
          return finalTx;
        })
      )
      .catch((error) => {
        console.log("error aprove", error);
        return error;
      });
  } catch (err) {
    return err;
  }
};

const toastHandler = async (toast, message, notify) => {
  toast(message, { appearance: notify });
};

const getSignature = async () => {
  const message = makeuid(32);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signature = await signer
    .signMessage(message)
    .catch((err) => console.log("errr rr: ", err));
  return { message, signature };
};

export default {
  makeuid,
  approveHandle,
  toastHandler,
  getSignature,
};
