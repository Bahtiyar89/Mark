import * as types from "./types";

export default (state, action) => {
  switch (action.type) {
    case types.LOADING:
      return { ...state, loading_product: action.payload };
    case types.GLOBAL_SEARCH_INPUT_CHANGED:
      return { ...state, searchTxt: action.payload };
    case types.CLEAR_CATEGORY:
      return { ...state, clear_category: action.payload };

    case types.PRICE_RANGE:
      const { min_price, max_price } = action.payload;
      return {
        ...state,
        minPrice: Math.floor(min_price),
        maxPrice: Math.ceil(max_price),
      };
    case types.GET_PRODUCTS:
      const newResponse = [];
      //   let minPrice;
      //  let maxPrice;

      const { count, results } = action.payload;
      // minPrice = Math.min(...results.map((item) => item.RecPrice));
      // maxPrice = Math.max(...results.map((item) => item.RecPrice));
      console.log("results ", action.payload);
      if (Object.keys(state.allProducts).length != 0) {
        let updatedStoredArr = results.map((a) => {
          const exists = state?.basket?.find(
            (b) => a.RecID === b.RecID && a.RecGroupId == b.RecGroupId
          );

          if (exists) {
            a = exists;
          } else {
            a = { ...a, count: 0 };
          }

          return a;
        });

        return {
          ...state,
          allProducts: updatedStoredArr,
          allProductsCount: count,
        };
      } else {
        for (let index = 0; index < results.length; index++) {
          const element = results[index];
          newResponse.push({ ...element, count: 0 });
        }
      }
      return {
        ...state,
        allProducts: newResponse,
        allProductsCount: count,
      };
    case types.GET_PRODUCTS_MIN_MAX:
      const newResp = [];

      const counts = action.payload.count;
      const result = action.payload.results;

      if (Object.keys(state.allProducts).length != 0) {
        let updatedStoredArr = result.map((a) => {
          const exists = state?.basket?.find(
            (b) => a.RecID === b.RecID && a.RecGroupId == b.RecGroupId
          );

          if (exists) {
            a = exists;
          } else {
            a = { ...a, count: 0 };
          }

          return a;
        });

        return {
          ...state,
          allProducts: updatedStoredArr,
          allProductsCount: counts,
        };
      } else {
        for (let index = 0; index < results.length; index++) {
          const element = results[index];
          newResp.push({ ...element, count: 0 });
        }
      }
      return { ...state, allProducts: newResp, allProductsCount: count };

    case types.ADD_PRODUCT_TO_BASKET:
      if (Object.keys(state.allProducts).length === 0) {
        console.log("yes ", action.payload);
        const newAr = [];
        if (Object.keys(state.basket).length != 0) {
          const checkBasket = state.basket.find(
            (elem) =>
              elem.RecID === action.payload.RecID &&
              elem.RecGroupId == action.payload.RecGroupId
          );

          if (checkBasket) {
            const newBasket = state.basket.map((b) => {
              if (
                b.RecID === action.payload.RecID &&
                b.RecGroupId === action.payload.RecGroupId
              ) {
                if (b.count < b.in_stock) {
                  b = { ...b, count: b.count + 1 };
                }
              }
              return b;
            });
            newBasket.map((c) => {
              newArray.push(c);
            });
          } else {
            [
              ...state.basket,
              { ...action.payload, count: action.payload.count + 1 },
            ].map((c) => {
              newArray.push(c);
            });
          }

          return {
            ...state,
            allProducts: newPr,
            basket: newArray,
          };
        } else {
          return {
            ...state,
            allProducts: [action.payload],
            basket: [
              ...state.basket,
              { ...action.payload, count: action.payload.count + 1 },
            ],
          };
        }
      }

      const newArray = [];

      const newPr = state.allProducts.map((c) => {
        if (
          c.RecID === action.payload.RecID &&
          c.RecGroupId === action.payload.RecGroupId
        ) {
          c = { ...c, count: c.count + 1 };
        }
        return c;
      });

      if (Object.keys(state.basket).length != 0) {
        const checkBasket = state.basket.find(
          (elem) =>
            elem.RecID === action.payload.RecID &&
            elem.RecGroupId == action.payload.RecGroupId
        );

        if (checkBasket) {
          const newBasket = state.basket.map((b) => {
            if (
              b.RecID === action.payload.RecID &&
              b.RecGroupId === action.payload.RecGroupId
            ) {
              if (b.count < b.in_stock) {
                b = { ...b, count: b.count + 1 };
              }
            }
            return b;
          });
          newBasket.map((c) => {
            newArray.push(c);
          });
        } else {
          [
            ...state.basket,
            { ...action.payload, count: action.payload.count + 1 },
          ].map((c) => {
            newArray.push(c);
          });
        }

        return {
          ...state,
          allProducts: newPr,
          basket: newArray,
        };
      } else {
        newPr.map((c) => {
          if (c.count != 0) {
            newArray.push(c);
          }
        });

        return {
          ...state,
          allProducts: newPr,
          basket: newArray,
        };
      }
    case types.SUBTRACT_PRODUCT_FROM_BASKET:
      const newArrayy = [];

      const newPrr = state.allProducts.map((c) => {
        if (
          c.RecID === action.payload.RecID &&
          c.RecGroupId === action.payload.RecGroupId
        ) {
          c = { ...c, count: c.count - 1 };
        }
        return c;
      });

      if (Object.keys(state.basket).length != 0) {
        const checkBasket = state.basket.find(
          (elem) =>
            elem.RecID === action.payload.RecID &&
            elem.RecGroupId == action.payload.RecGroupId
        );

        if (checkBasket) {
          const newBasket = state.basket.map((b) => {
            if (
              b.RecID === action.payload.RecID &&
              b.RecGroupId === action.payload.RecGroupId
            ) {
              b = { ...b, count: b.count - 1 };
            }
            return b;
          });
          newBasket.map((c) => {
            newArrayy.push(c);
          });
        } else {
          [
            ...state.basket,
            { ...action.payload, count: action.payload.count - 1 },
          ].map((c) => {
            newArrayy.push(c);
          });
        }

        return {
          ...state,
          allProducts: newPrr,
          basket: newArrayy,
        };
      } else {
        newPrr.map((c) => {
          if (c.count != 0) {
            newArray.push(c);
          }
        });

        return {
          ...state,
          allProducts: newPrr,
          basket: newArray,
        };
      }

    case types.REMOVE_PRODUCT_FROM_BASKET:
      var filtered = state.basket.filter(
        (b) => b.RecID != action.payload.RecID
      );

      return {
        ...state,
        basket: filtered,
      };

    case types.ADD_A_PRODUCT_TO_BASKET:
      const newArrayBasket = [];
      if (Object.keys(state.basket).length != 0) {
        const checkBasket = state.basket.find(
          (elem) =>
            elem.RecID === action.payload.RecID &&
            elem.RecGroupId == action.payload.RecGroupId
        );

        if (checkBasket) {
          const newBasket = state.basket.map((b) => {
            if (
              b.RecID === action.payload.RecID &&
              b.RecGroupId === action.payload.RecGroupId
            ) {
              b = action.payload;
            }
            return b;
          });
          newBasket.map((c) => {
            newArrayBasket.push(c);
          });
        } else {
          [...state.basket, action.payload].map((c) => {
            newArray.push(c);
          });
        }
        console.log("newArrayBasket: ", newArrayBasket);
        return {
          ...state,
          allProducts: newArrayBasket,
          basket: newArrayBasket,
        };
      } else {
        return {
          ...state,
          basket: [action.payload],
        };
      }
    case types.GET_A_PRODUCT:
      return {
        ...state,
        product_detail: { ...action.payload, count: 0 },
      };
    case types.REVIEW_PRODUCT:
      return {
        ...state,
        product_review: action.payload,
      };
    case types.CAN_PUT_REVIEW_PRODUCT:
      return {
        ...state,
        can_review: action.payload,
      };
    case types.CLEAR_BASKET:
      return { ...state, basket: [] };

    /*
    case types.MAX_MIN_HANDLE:
      const newPrArr = [];

      const array = action.payload;

      console.log("array::: 33", array);
      const min = array[0];
      const max = array[1];

      if (Object.keys(state.allProducts).length != 0) {
        for (
          let index = 0;
          index < Object.keys(state.allProducts).length;
          index++
        ) {
          const element = state.allProducts[index];
          if (element.RecPrice >= min && element.RecPrice <= max) {
            newPrArr.push(element);
          }
        }

        return { ...state, allProducts: newPrArr };
      }
      return { ...state };
*/
    default:
      return state;
  }
};
