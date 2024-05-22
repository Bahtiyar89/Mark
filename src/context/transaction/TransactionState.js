import React, { useReducer } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import {
  doDelete,
  doGet,
  doGetBody,
  doPost,
  doPut,
} from "../../utils/apiActions";
import TransactionContext from "./TransactionContext";
import TransactionReducer from "./TransactionReducer";

import * as types from "./types";

const TransactionState = (props) => {
  const initialState = {
    loading_order: false,
    allTransactions: [],
    allOrders: [],
    addresses: [],
    delivery_price: 0,
    orderDetails: {},
    selected_adress: {},
    order_id: 0,
  };
  const [t, i18n] = useTranslation();
  const { addToast } = useToasts();
  const [state, dispatch] = useReducer(TransactionReducer, initialState);

  const getAddress = async () => {
    doGet(`/ru/order/address/`)
      .then(({ data }) => {
        dispatch({ type: types.GET_ADDRESS, payload: data });
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  const postAddress = async (form) => {
    doPost(`/ru/order/address/`, form)
      .then(({ data }) => {
        addToast(t("new_address_saved_successfully"), {
          appearance: "success",
        });
        getAddress();
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };
  const deleteAddress = async (id) => {
    doDelete(`/ru/order/address/edit/${id}/`)
      .then(({ data }) => {
        console.log("data: ", data);
        addToast(t("address_deleted_successfully"), { appearance: "success" });
        getAddress();
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };
  const editAddress = async (form) => {
    doPut(`/ru/order/address/edit/${form.id}/`, form)
      .then(({ data }) => {
        console.log("data: ", data);
        addToast(t("address_edited_successfully"), { appearance: "success" });
        getAddress();
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  const postCalculateDeliveryAdress = async (adresses, form) => {
    doPost(`/ru/order/address/delivery/${adresses.id}/`, form)
      .then(({ data }) => {
        dispatch({
          type: types.GET_DELIVERY_PRICE_SET_SELECTED_ADRESS,
          payload: {
            delivery_price: data.delivery_price,
            selected_adress: adresses,
          },
        });
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  const getAllOrders = async () => {
    doGet("/order/get_all/")
      .then(({ data }) => {
        dispatch({ type: types.GET_ALL_ORDERS, payload: data });
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  const getOrderDetails = async (id) => {
    dispatch({ type: types.LOADING_ORDER, payload: true });
    doGet(`/order/order/detail/${id}/`)
      .then(({ data }) => {
        dispatch({ type: types.LOADING_ORDER, payload: false });
        dispatch({ type: types.GET_DETAILS, payload: data });
      })
      .catch((error) => {
        dispatch({ type: types.LOADING_ORDER, payload: false });
        console.log("error ", error);
      });
  };

  const postNewOrder = async (order) => {
    console.log("order: ", order);
    doPost("/ru/order/create/", order)
      .then(({ data }) => {
        dispatch({
          type: types.POST_ORDER_ID,
          payload: data?.order_id,
        });
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  const cancelOrder = async (id) => {
    doDelete(`/order/order/cancel/${id}/`)
      .then(({ data }) => {
        addToast(t("order_successfully_canceled"), { appearance: "success" });
        getAllOrders();
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  const clearDeliveryPrice = async () => {
    console.log("clear worked");
    dispatch({
      type: types.CLEAR_DELIVERY_PRICE,
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        loading_order: state.loading_order,
        allTransactions: state.allTransactions,
        addresses: state.addresses,
        delivery_price: state.delivery_price,
        allOrders: state.allOrders,
        orderDetails: state.orderDetails,
        selected_adress: state.selected_adress,
        order_id: state.order_id,
        getAddress,
        postAddress,
        editAddress,
        deleteAddress,
        postCalculateDeliveryAdress,
        clearDeliveryPrice,
        postNewOrder,
        getAllOrders,
        getOrderDetails,
        cancelOrder,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionState;
