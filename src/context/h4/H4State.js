import { useReducer } from "react";
import { useToasts } from "react-toast-notifications";
import { doGet } from "../../utils/apiActions";
import H4Context from "./H4Context";
import H4Reducer from "./H4Reducer";

import * as types from "./types";

const H4State = (props) => {
  const initialState = {
    countryList: [],
  };
  const { addToast } = useToasts();
  const [state, dispatch] = useReducer(H4Reducer, initialState);

  const getCountries = async () => {
    doGet("/ru/order/countries/")
      .then(({ data }) => {
        dispatch({ type: types.GET_ALL_COUNTRY, payload: data });
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  return (
    <H4Context.Provider
      value={{
        countryList: state.countryList,
        getCountries,
      }}
    >
      {props.children}
    </H4Context.Provider>
  );
};

export default H4State;
