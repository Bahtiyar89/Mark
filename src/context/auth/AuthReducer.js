import { removeItemFromStorage, setItemToStorage } from "utils/localStorage";
import * as types from "./types";

export default (state, action) => {
  switch (action.type) {
    case types.AUTH_LOADING:
      return { ...state, loading: action.payload };

    case types.METAMASK_WALLET:
      const { accounts, balance, chainId } = action.payload;
      return {
        ...state,
        metamaskAccounts: accounts,
        metamaskBalance: balance,
        metamaskChainId: chainId,
      };

    case types.METAMASK_CHAIN:
      return {
        ...state,
        metamaskChainId: action.payload,
      };
    case types.LOGIN_SUCCESS:
      const { access, refresh, address, message, signature } = action.payload;
      console.log("access:: ", access);
      setItemToStorage("access_token", access);
      setItemToStorage("wallet_address", address);
      return {
        ...state,
        isSigned: true,
        address: address,
        access_token: access,
        refresh_token: refresh,
      };

    case types.LOGIN_FAIL:
      removeItemFromStorage("access_token");
      return {
        ...state,
        isSigned: false,
        loading: false,
      };
    case types.LOGOUT:
      removeItemFromStorage("access_token");
      removeItemFromStorage("wallet_address");
      return {
        ...state,
        isSigned: false,
        address: "",
        access_token: "",
        refresh_token: "",
        loading: false,
        error: [],
      };

    default:
      return state;
  }
};
