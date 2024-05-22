import * as types from "./types";

export default (state = { allTransactions: [] }, action) => {
  switch (action.type) {
    case types.LOADING_ORDER:
      return { ...state, loading_order: action.payload };
    case types.GET_ALL_TRANSACTIONS:
      return { ...state, allTransactions: action.payload };
    case types.GET_ADDRESS:
      return { ...state, addresses: action.payload };
    case types.GET_DELIVERY_PRICE_SET_SELECTED_ADRESS:
      const { delivery_price, selected_adress } = action.payload;
      return {
        ...state,
        selected_adress,
        delivery_price,
      };
    case types.CLEAR_DELIVERY_PRICE:
      return {
        ...state,
        delivery_price: 0,
      };
    case types.GET_ALL_ORDERS:
      return { ...state, allOrders: action.payload };
    case types.GET_DETAILS:
      return { ...state, orderDetails: action.payload };
    case types.POST_ORDER_ID:
      console.log("action.payload: ", action.payload);
      return { ...state, order_id: action.payload };
    default:
      return state;
  }
};
