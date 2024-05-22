import * as types from "./types";

export default (state = { global_language: "ru" }, action) => {
  switch (action.type) {
    case types.POST_GLOBAL_LANGUAGE:
      return { ...state, global_language: action.payload };
    default:
      return state;
  }
};
