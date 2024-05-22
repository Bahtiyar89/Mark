import React, { useRef, useEffect, useState } from "react";
import moment from "moment";

const Messages = ({ userMessages, selectedUser }) => {
  const ref = useRef();
  const [browserNotification, setBrowserNotification] = useState({
    title: "New Message",
    favicon: null,
    notificationFavicon: null,
    notificationCount: 0,
  });

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages]);

  const addNotification = () => {
    document.title = `(${browserNotification.notificationCount}) ${browserNotification.title}`;

    setBrowserNotification({
      ...browserNotification,
      notificationCount: browserNotification.notificationCount + 1,
    });
  };
  return (
    <div className="messages">
      {userMessages?.map((m) => {
        return (
          <div className={`message ${m.is_support_message && "owner"}`}>
            <div ref={ref} className="messageContent">
              <p>{m.message}</p>
              <span style={{ fontSize: 10 }}>
                {moment(m?.timestamp).format("DD.MM.YYYY")}
              </span>
            </div>
          </div>
        );
      })}

      <button
        style={{
          marginRight: "1em",
          marginBottom: "1em",
        }}
        onClick={addNotification}
      >
        Add New Notification
      </button>
    </div>
  );
};

export default Messages;
