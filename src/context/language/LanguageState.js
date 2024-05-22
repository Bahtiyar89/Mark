import React, { useReducer } from "react";
import LanguageContext from "./LanguageContext";
import LanguageReducer from "./LanguageReducer";

import { POST_GLOBAL_LANGUAGE } from "./types";
import { getItemFromStorage } from "utils/localStorage";

const initialState = {
  global_language: getItemFromStorage("lang"),
};

const LanguageState = (props) => {
  const [state, dispatch] = useReducer(LanguageReducer, initialState);

  const postGlobalLanguage = (lang) => {
    dispatch({ type: POST_GLOBAL_LANGUAGE, payload: lang });
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
