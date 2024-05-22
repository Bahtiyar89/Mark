import React, { useRef, useState, useEffect } from "react";
import classnames from "classnames";
import ChatMessage from "../chat_message";
import "./chat-window.css";
import {
  ActionIcon,
  Button,
  CloseButton,
  FileButton,
  TextInput,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons";
import { useTranslation } from "react-i18next";

const ChatWindow = ({
  isOpen,
  messages,
  onClose,
  onMessageSent,
  position,
  title,
}: any) => {
  const [t, i18n] = useTranslation();
  const chatWindow = useRef<HTMLInputElement>(null);
  const chatWindowBody = useRef<HTMLInputElement>(null);
  const userInput = useRef<HTMLInputElement>(null);
  const [userMessage, setUserMessage] = useState("");
  const [file, setFile] = useState("");

  const handleChange = (event: any) => {
    if (event) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;

        // @ts-ignore:
        base64Image.replace(
          /^data:image\/[a-z]+;base64,/,
          ""
        );
        onMessageSent(base64Image);
      };

      reader.readAsDataURL(event);
    }
  };

  const handleSubmit = () => {
    onMessageSent(userMessage);
    setUserMessage("");
  };

  const setChatWindowScrollPosition = () => {
    const _chatWindowBody = chatWindowBody.current;
    // @ts-ignore
    _chatWindowBody.scrollTop = _chatWindowBody.scrollHeight;
  };

  const autExpandInput = () => {
    const _userInput = userInput.current;
    // @ts-ignore
    _userInput.style.height = "auto";
    // @ts-ignore
    _userInput.style.height = `${_userInput.scrollHeight}px`;
  };

  useEffect(() => {
    setChatWindowScrollPosition();
  }, [messages]);

  useEffect(() => {
    autExpandInput();
  }, [userMessage]);

  return (
    <div
      ref={chatWindow}
      className={classnames("chat-window", {
        "is-open": isOpen,
        [`chat-window--${position}`]: position,
      })}
    >
      <div className="chat-window__header">
        <div className="chat-window__title">{title}</div>
        <CloseButton
          className="chat-window__close-btn"
          onClick={() => onClose()}
          aria-label="Close modal"
        />
      </div>
      <div ref={chatWindowBody} className="chat-window__body">
        {messages.map(({ is_support_message, ...props }: any) => {
          return (
            <ChatMessage
              key={Math.random()}
              is_support_message={is_support_message}
              {...props}
              file={file}
            />
          );
        })}
      </div>
      <div className="chat-window__footer">
        <TextInput
          ref={userInput}
          styles={(theme) => ({
            input: {
              border: "0px",
            },
          })}
          className="input"
          placeholder={t("your_question")}
          rightSection={
            <FileButton onChange={handleChange} accept="image/png,image/jpeg">
              {(props) => (
                <ActionIcon
                  {...props}
                  onChange={handleChange}
                  variant="transparent"
                  style={{ textAlign: "center" }}
                >
                  <IconPhoto size={28} />
                </ActionIcon>
              )}
            </FileButton>
          }
          onChange={(val: any) => setUserMessage(val.target.value)}
          value={userMessage}
        />
        <Button
          className="chat-window__send-btn"
          type="button"
          onClick={() => handleSubmit()}
        >
          {t("send")}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ChatWindow);
