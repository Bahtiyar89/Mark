import { useRef, useEffect, useState } from "react";
import moment from "moment";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
const { REACT_APP_BASE_URL } = process.env;

const Chat = ({
  messages,
  selectedUser,
  userMessages,
  inputText,
  handleInput,
  handleInputClick,
}) => {
  const ref = useRef();
  const [browserNotification, setBrowserNotification] = useState({
    title: "New Message",
    notificationCount: 0,
  });

  const handleFocus = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setBrowserNotification({
        ...browserNotification,
        notificationCount: 0,
      });
      document.title = `(${browserNotification.notificationCount}) ${browserNotification.title}`;
    }
  };

  useEffect(() => {
    document.title = `(${browserNotification.notificationCount}) ${browserNotification.title}`;

    setBrowserNotification({
      ...browserNotification,
      notificationCount: browserNotification.notificationCount + 1,
    });
  }, [messages]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages]);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{selectedUser?.username}</span>
        {/*<div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>*/}
      </div>

      <div onScroll={handleFocus} className="messages">
        {userMessages?.map((m) => {
          return (
            <div className={`message ${m.is_support_message && "owner"}`}>
              <div ref={ref} className="messageContent">
                <p>
                  {m.message}
                  {m.image && (
                    <img
                      alt="preview image"
                      src={`${REACT_APP_BASE_URL}.${m.image}`}
                    />
                  )}
                </p>
                <span style={{ fontSize: 10 }}>
                  {moment(m?.timestamp).format("DD.MM.YYYY")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Input
        inputText={inputText}
        handleInput={handleInput}
        handleInputClick={handleInputClick}
        handleFocus={handleFocus}
      />
    </div>
  );
};

export default Chat;
