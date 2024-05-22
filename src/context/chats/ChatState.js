import { useReducer } from "react";
import ChatContext from "./ChatContext";
import ChatReducer from "./ChatReducer";
import { doGet } from "../../utils/apiActions";
import * as types from "./types";

const initialState = {
  chatHistory: [],
};

const CatalogState = (props) => {

  const [state, dispatch] = useReducer(ChatReducer, initialState);

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
