import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { useTranslation } from "react-i18next";
import { Button, Container, Grid, Modal, Text } from "@mantine/core";
import { useToasts } from "react-toast-notifications";
import AuthContext from "context/auth/AuthContext";
import ChatContext from "../../context/chats/ChatContext";
import depositAbi from "utils/depositAbi";
import { getItemFromStorage } from "utils/localStorage";
import TransactionContext from "../../context/transaction/TransactionContext";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import "./style.css";
import Utils from "utils/Utils";
import { useNavigate } from "react-router-dom";
import useWebSocket from "./useWebSocket";

const { REACT_APP_BASE_URL } = process.env;

function Adminchat() {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const chatContext = useContext(ChatContext);
  const [t, i18n] = useTranslation();
  const { chatHistory, getChatHistory } = chatContext;
  const authContext = useContext(AuthContext);
  const { isSigned, signin, access_token } = authContext;
  const [openedAdd, setOpenedAdd] = useState(false);
  const [rightsMessage, setRightsMessage] = useState("");
  const [sideBarUsers, setSideBarUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({ id: null, username: "" });
  const [userMessages, setUserMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const { messages, sendMessage } = useWebSocket(
    "wss://chat.market.swttoken.com/ws/chat/",
    access_token
  );

  const handleUser = async (user: any) => {
    setSelectedUser(user);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    fetch(
      `${REACT_APP_BASE_URL}/ru/chat/history/staff/${user.id}/`,
      requestOptions
    )
      .then((res: any) => {
        res.json().then(async (data: any) => {
          console.log("data:::44 ", data);
          setUserMessages(data);
        });
      })
      .catch((error: any) => {
        console.log("error::: ", error);
      });
  };

  const handleSign = async (address: string) => {
    const { message, signature } = await Utils.getSignature();

    signin({
      address: address,
      message: message,
      signature: signature,
    });
  };

  const getChatUsers = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    fetch(`${REACT_APP_BASE_URL}/ru/chat/users/`, requestOptions)
      .then((res: any) => {
        res.json().then(async (data: any) => {
          console.log("res.status ", res.status);
          if (res.status === 403) {
            setRightsMessage(data?.detail);
            await setOpenedAdd(true);
          } else {
            setSideBarUsers(data);
          }
          console.log("data::: ", data);
        });
      })
      .catch((error: any) => {
        console.log("error::: ", error);
      });
  };

  useEffect(() => {
    if (isSigned) {
      //setOpenedAdd(true);
      getChatUsers();
    } else {
      if (window.ethereum) {
        window.ethereum
          .request?.({ method: "eth_requestAccounts" })
          .then(async (res) => {
            handleSign(res[0]);
          })
          .catch((error) => {
            addToast(t("please_login_to_metamask"), {
              appearance: "error",
            });
          });
      }
    }
  }, [isSigned]);

  useEffect(() => {
    handleUser(selectedUser);
  }, [messages]);

  const handleModalError = () => {
    navigate(`/`);
  };

  const handleInput = (val: string) => {
    setInputText(val);
  };

  const handleInputClick = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ message: inputText }),
    };

    fetch(
      `${REACT_APP_BASE_URL}/chat/history/staff/${selectedUser.id}/`,
      requestOptions
    )
      .then((res: any) => {
        res.json().then(async (data: any) => {
          console.log("res.status ", res.status);

          if (res.status === 200) {
            handleUser(selectedUser);
            setInputText("");
            addToast("Ваше сообщение было успешно отправлено", {
              appearance: "success",
            });
          }
          console.log("data::: ", data);
        });
      })
      .catch((error: any) => {
        console.log("error::: ", error);
      });
  };

  console.log("messages:: :", messages);

  return (
    <div className="home">
      <div className="container">
        <Sidebar handleUser={handleUser} sideBarUsers={sideBarUsers} />
        <Chat
          messages={messages}
          selectedUser={selectedUser}
          userMessages={userMessages}
          inputText={inputText}
          handleInput={handleInput}
          handleInputClick={handleInputClick}
        />
      </div>
      <Modal
        opened={openedAdd}
        onClose={() => setOpenedAdd(false)}
        title="Добавть отзыв!"
        overlayOpacity={0.9}
        style={{ zIndex: 11111 }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text size={"sm"}>{rightsMessage}</Text>
          <Button
            color="red"
            onClick={() => handleModalError()}
            style={{ marginTop: 10, alignSelf: "end" }}
          >
            Назад
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Adminchat;
