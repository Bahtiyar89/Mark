import * as types from "./types";

export default (state, action) => {
  switch (action.type) {
    case types.LOADING:
      return { ...state, loading_product: action.payload };
    case types.GET_CHAT_HISTORY:
      return { ...state, chatHistory: action.payload };

    default:
      return state;
  }
};
