import * as types from "./types";

export default (state = { countryList: [] }, action) => {
  switch (action.type) {
    case types.GET_ALL_COUNTRY:
      return { ...state, countryList: action.payload };
    default:
      return state;
  }
};
