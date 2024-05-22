import React, { useReducer } from "react";
import LanguageContext from "./LanguageContext";
import LanguageReducer from "./LanguageReducer";

import * as types from "./types";
import { getItemFromStorage } from "utils/localStorage";

const LanguageState = (props) => {
  const initialState = {
    global_language: getItemFromStorage("lang"),
  };
  const [state, dispatch] = useReducer(LanguageReducer, initialState);

  const postGlobalLanguage = async (lang) => {
    dispatch({ type: types.POST_GLOBAL_LANGUAGE, payload: lang });
  };

  return (
    <LanguageContext.Provider
      value={{
        global_language: state.global_language,
        postGlobalLanguage,
      }}
    >
      {props.children}
    </LanguageContext.Provider>
  );
};

export default LanguageState;
