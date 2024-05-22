import React, { useReducer } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import { doGet, doPost } from "../../utils/apiActions";
import * as types from "./types";

const AuthState = (props) => {
  const { addToast } = useToasts();
  const [t, i18n] = useTranslation();
  const initialState = {
    isSigned: false,
    access_token: null,
    refresh_token: null,
    address: null,
    signature: null,
    error: [],
    auth_loading: false,
    metamaskAccounts: [],
    metamaskBalance: "",
    metamaskChainId: "",
  };
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  //Login User
  const signin = (FormData) => {
    console.log("FormData: ,", FormData);
    doPost("/auth/metamask/auth/", FormData)
      .then(({ data }) => {
        dispatch({ type: types.LOGIN_SUCCESS, payload: data });
      })
      .catch((error) => {
        console.log("error ", error);
        addToast(t("something_wrong_try_later"), { appearance: "error" });
      });
  };

  const metamaskWallet = (wallet) => {
    dispatch({ type: types.METAMASK_WALLET, payload: wallet });
  };

  const metamaskChain = (chain) => {
    dispatch({ type: types.METAMASK_CHAIN, payload: chain });
  };

  //logout
  const signOut = async () => {
    try {
      dispatch({
        type: types.LOGOUT,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isSigned: state.isSigned,
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        address: state.address,
        signature: state.signature,
        auth_loading: state.loading,
        metamaskAccounts: state.metamaskAccounts,
        metamaskBalance: state.metamaskBalance,
        metamaskChainId: state.metamaskChainId,
        error: state.error,
        signin,
        signOut,
        metamaskWallet,
        metamaskChain,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
