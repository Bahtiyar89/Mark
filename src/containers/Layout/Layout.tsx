import React, { useContext, useEffect, useState } from "react";
import Header from "containers/Header";
import { Outlet } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Footer from "containers/Footer";
import { useTranslation } from "react-i18next";
import AuthContext from "context/auth/AuthContext";
import { ReactComponent as ChatButton } from "assets/chatButton.svg";
import ChatContext from "../../context/chats/ChatContext";
import useWebSocket from "./useWebSocket";
import Utils from "utils/Utils";

const ChatWindow = React.lazy(() => import("./CustomChat/chat_window"))

function Layout() {
  const [t, i18n] = useTranslation();
  const { addToast } = useToasts();
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);
  const { chatHistory, getChatHistory } = chatContext;
  const { isSigned, access_token, signin } = authContext;
  const [chHistory, setChHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage } = useWebSocket(
    "wss://chat.market.swttoken.com/ws/chat/",
    access_token
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    getChatHistory();

    setChHistory(chatHistory);
  }, [access_token]);

  useEffect(() => {
    let newMessages = chHistory.concat(messages);
    setChHistory(newMessages);
  }, [messages]);

  const handleSendMessage = (val: string) => {
    sendMessage(JSON.stringify({ image: `url(${val})` }));
  };

  const handleSign = async (address: string) => {
    const { message, signature } = await Utils.getSignature();
    await setIsOpen(true);
    signin({
      address: address,
      message: message,
      signature: signature,
    });
  };

  const handleMetamaskOpen = () => {
    if (isSigned) {
      setIsOpen(!isOpen);
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
  };

  const handleChatOpenButton = () => {
    if (!isSigned) {
      handleMetamaskOpen();
    }

    setIsOpen(!isOpen);
  };

  return (<>
    <div
      style={{
        backgroundColor: "#E8EBF4",
        borderBottomLeftRadius: "40px",
        borderBottomRightRadius: "40px",
        height: "100%",
        width: "100%",
      }}
    >
      <Header />
      <Outlet />
    </div>

    <Footer />

    <button
      style={{
        position: "sticky",
        float: "right",
        right: 30,
        bottom: 30,
        width: 52,
        height: 52,
        borderRadius: 30,
        borderWidth: "0px",
        backgroundColor: "#4E8BFF",
      }}
      className="chat-btn"
      type="button"
      onClick={handleChatOpenButton}
    >
      <ChatButton />
    </button>

    {isOpen && <ChatWindow
      isOpen={isOpen}
      messages={chHistory}
      onClose={handleClose}
      onMessageSent={handleSendMessage}
      title={t("online_operator")}
      position={"bottom-right"}
    />}
  </>
  );
}

export default React.memo(Layout);
