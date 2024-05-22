import React, { useReducer } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import ChatContext from "./ChatContext";
import ChatReducer from "./ChatReducer";
import { doGet, doPost, doPostImage } from "../../utils/apiActions";
import * as types from "./types";
import { removeItemFromStorage } from "utils/localStorage";

const CatalogState = (props) => {
  const initialState = {
    chatHistory: [],
  };
  const [t, i18n] = useTranslation();
  const [state, dispatch] = useReducer(ChatReducer, initialState);
  const { addToast } = useToasts();

  const getChatHistory = async () => {
    doGet(`/ru/chat/history/`)
      .then(({ data }) => {
        dispatch({
          type: types.GET_CHAT_HISTORY,
          payload: data,
        });
      })
      .catch((error) => {
        console.log("error2 ", error?.response?.status);
      });
  };

  const getChatList = async () => {
    doGet(`/ru/chat/users/`)
      .then(({ data }) => {
        console.log("users", data);
      })
      .catch((error) => {
        console.log("error2 ", error?.response?.status);
      });
  };

  return (
    <ChatContext.Provider
      value={{
        chatHistory: state.chatHistory,
        error: state.error,
        getChatHistory,
        getChatList,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default CatalogState;
