import React, { useReducer } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import ProductContext from "./ProductContext";
import ProductReducer from "./ProductReducer";
import { doGet, doPost, doPostImage } from "../../utils/apiActions";
import * as types from "./types";
import { removeItemFromStorage } from "utils/localStorage";

const CatalogState = (props) => {
  const initialState = {
    allProducts: [],
    basket: [],
    error: [],
    product_detail: {},
    product_review: {},
    loading_product: false,
    allProductsCount: 60,
    minPrice: null,
    maxPrice: null,
    can_review: false,
    clear_category: false,
    searchTxt: "",
  };
  const [t, i18n] = useTranslation();
  const [state, dispatch] = useReducer(ProductReducer, initialState);
  const { addToast } = useToasts();

  const getPriceRange = async () => {
    doGet(`/v2/product-api/price-range/`)
      .then(({ data }) => {
        dispatch({
          type: types.PRICE_RANGE,
          payload: data,
        });
      })
      .catch((error) => {
        console.log("error2 ", error?.response?.status);
      });
  };

  const getAllProducts = async (form = `page=1&page_size=24`) => {
    console.log("form: 99", form);
    dispatch({ type: types.LOADING, payload: true });
    doGet(`/ru/product-api/all/?${form}`)
      .then(({ data }) => {
        dispatch({ type: types.LOADING, payload: false });
        dispatch({
          type: types.GET_PRODUCTS,
          payload: data,
        });
      })
      .catch((error) => {
        dispatch({ type: types.LOADING, payload: false });
        if (error?.response?.status === 401) {
          removeItemFromStorage("access_token");
          getAllProducts();
        }
        console.log("error2 ", error?.response?.status);
      });
  };

  const getProductsByCategories = async (form = `page=1&page_size=24`) => {
    dispatch({ type: types.LOADING, payload: true });
    doGet(`/ru/product-api/all/?${form}`)
      .then(({ data }) => {
        dispatch({ type: types.LOADING, payload: false });
        dispatch({
          type: types.GET_PRODUCTS,
          payload: data,
        });
        getPriceRange();
      })
      .catch((error) => {
        dispatch({ type: types.LOADING, payload: false });
        if (error?.response?.status === 401) {
          removeItemFromStorage("access_token");
          getAllProducts();
        }
        console.log("error ", error);
      });
  };

  const getProductsByMinMax = async (form = `page=1&page_size=24`) => {
    // dispatch({ type: types.LOADING, payload: true });
    console.log("form: 55", form);
    doGet(`/ru/product-api/all/?${form}`)
      .then(({ data }) => {
        dispatch({ type: types.LOADING, payload: false });
        dispatch({
          type: types.GET_PRODUCTS_MIN_MAX,
          payload: data,
        });
      })
      .catch((error) => {
        dispatch({ type: types.LOADING, payload: false });
        console.log("error ", error);
      });
  };

  const addProductToBasket = async (product) => {
    try {
      dispatch({
        type: types.ADD_PRODUCT_TO_BASKET,
        payload: product,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const subtractProductFromBasket = async (product) => {
    try {
      dispatch({
        type: types.SUBTRACT_PRODUCT_FROM_BASKET,
        payload: product,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getDetailedProduct = async (id) => {
    dispatch({ type: types.LOADING, payload: true });
    doGet(`/ru/product-api/detail/${id}/`)
      .then(({ data }) => {
        console.log("data: ", data);
        dispatch({ type: types.LOADING, payload: false });
        dispatch({
          type: types.GET_A_PRODUCT,
          payload: data,
        });
      })
      .catch((error) => {
        dispatch({ type: types.LOADING, payload: false });
        console.log("error ", error);
      });
  };

  const getReviewProduct = async (id, page) => {
    dispatch({ type: types.LOADING, payload: true });
    doGet(`/reviews/products/${id}/?page=${page}&page_size=8`)
      .then(({ data }) => {
        console.log("data: ", data);
        dispatch({ type: types.LOADING, payload: false });
        dispatch({
          type: types.REVIEW_PRODUCT,
          payload: data,
        });
      })
      .catch((error) => {
        dispatch({ type: types.LOADING, payload: false });
        console.log("error ", error);
      });
  };

  const checkGetReviewProduct = async (id, page) => {
    dispatch({ type: types.LOADING, payload: true });
    doGet(`/reviews/can-review-check/?product_id=${id}`)
      .then(({ data }) => {
        dispatch({ type: types.LOADING, payload: false });
        dispatch({
          type: types.CAN_PUT_REVIEW_PRODUCT,
          payload: data?.can_review,
        });
      })
      .catch((error) => {
        dispatch({ type: types.LOADING, payload: false });
        console.log("error ", error);
      });
  };

  const getProductsbySearch = async (form = `page=1&page_size=24`) => {
    // dispatch({ type: types.LOADING, payload: true });
    console.log("form: 88", form);
    doGet(`/ru/product-api/all/?${form}`)
      .then(({ data }) => {
        dispatch({ type: types.LOADING, payload: false });
        dispatch({
          type: types.GET_PRODUCTS,
          payload: data,
        });
      })
      .catch((error) => {
        dispatch({ type: types.LOADING, payload: false });
        console.log("error ", error);
      });
  };

  const postReview = async (id, form) => {
    doPost(`/reviews/products/${id}/`, form)
      .then(({ data }) => {
        console.log("3333: ", data);
        addToast(t("review_commit"), {
          appearance: "success",
        });
      })
      .catch((error) => {
        addToast(error?.response?.data?.detail, {
          appearance: "error",
        });
        console.log("error ", error);
      });
  };
  const postReviewImage = async (id, form) => {
    doPostImage(`/reviews/products/${id}/`, form)
      .then(({ data }) => {
        console.log("3333: ", data);
        addToast(t("review_commit"), {
          appearance: "success",
        });
      })
      .catch((error) => {
        addToast(error?.response?.data?.detail, {
          appearance: "error",
        });
        console.log("error ", error?.response?.data?.detail);
      });
  };

  const removeProductFromBasket = async (product) => {
    try {
      dispatch({
        type: types.REMOVE_PRODUCT_FROM_BASKET,
        payload: product,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const clearBasket = async () => {
    try {
      dispatch({ type: types.CLEAR_BASKET });
    } catch (err) {
      console.log(err);
    }
  };

  const clearCategory = async (data) => {
    try {
      dispatch({ type: types.CLEAR_CATEGORY, payload: data });
    } catch (err) {
      console.log(err);
    }
  };

  const postReviewCommit = async (obj) => {
    doPost(`/reviews/products/answer-to-review/`, obj)
      .then(({ data }) => {
        console.log("3333: ", data);
        addToast(t("review_commit"), {
          appearance: "success",
        });
      })
      .catch((error) => {
        addToast(error?.response?.data?.detail, {
          appearance: "error",
        });
        console.log("error ", error);
      });
  };

  const globalSearchChanged = async (value) => {
    dispatch({
      type: types.GLOBAL_SEARCH_INPUT_CHANGED,
      payload: value,
    });
  };

  return (
    <ProductContext.Provider
      value={{
        loading_product: state.loading_product,
        error: state.error,
        productLoading: state.productLoading,
        allProducts: state.allProducts,
        allProductsCount: state.allProductsCount,
        basket: state.basket,
        product_detail: state.product_detail,
        product_review: state.product_review,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        can_review: state.can_review,
        searchTxt: state.searchTxt,
        clear_category: state.clear_category,
        clearCategory,
        globalSearchChanged,
        postReviewImage,
        getAllProducts,
        addProductToBasket,
        removeProductFromBasket,
        getProductsByCategories,
        getProductsByMinMax,
        getDetailedProduct,
        getProductsbySearch,
        subtractProductFromBasket,
        postReview,
        postReviewCommit,
        clearBasket,
        getReviewProduct,
        checkGetReviewProduct,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default CatalogState;
