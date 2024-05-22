import axios from "axios";
import { getItemFromStorage } from "./localStorage";
const { REACT_APP_BASE_URL } = process.env;

export const doGet = async (uri, formdata, params = {}) => {
  const access_token = await getItemFromStorage("access_token");
  let config;
  if (access_token === null) {
    config = {
      headers: {
        "Content-Type": "application/json",
      },
      params,
      data: formdata,
    };
  } else {
    config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      params,
      data: formdata,
    };
  }

  return await axios.get(REACT_APP_BASE_URL + uri, config);
};

export const doGetBody = async (uri, formdata, params = {}) => {
  const access_token = await getItemFromStorage("access_token");
  console.log("access_token: 2", access_token);

  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA2MzI4NDYxLCJpYXQiOjE3MDYyNDIwNjEsImp0aSI6IjlmMzI5ZGU4MDU3MzQ3YjdiY2Q5NDYzOTg3ZGFmZmM0IiwidXNlcl9pZCI6Mn0.CAGwHvGgtI4_9PS_XLkAkT2cnPvuH-eHLGh75G2Z4n0`,
      "Content-Type": "application/json",
    },
    params,
    data: formdata,
  };

  console.log("fconfig :", config);
  console.log("formdata :", formdata);
  return await axios.get(REACT_APP_BASE_URL + uri, formdata, config);
};

export const doPost = async (uri, formdata, params = {}) => {
  const access_token = await getItemFromStorage("access_token");
  console.log("access_token: ", access_token);

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    params,
  };

  return await axios.post(REACT_APP_BASE_URL + uri, formdata, config);
};

export const doPostImage = async (uri, formdata, params = {}) => {
  const access_token = await getItemFromStorage("access_token");
  console.log("access_token: ", access_token);

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
      "content-type": "multipart/form-data",
    },
    params,
  };
  return await axios.post(REACT_APP_BASE_URL + uri, formdata, config);
};

export const doDelete = async (uri, params = {}) => {
  const access_token = await getItemFromStorage("access_token");
  console.log("access_token: ", access_token);
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    params,
  };
  console.log("config: ", config);
  return await axios.delete(REACT_APP_BASE_URL + uri, config);
};

export const doPut = async (uri, formdata, params = {}) => {
  const access_token = await getItemFromStorage("access_token");
  console.log("access_token: ", access_token);

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    params,
  };

  return await axios.put(REACT_APP_BASE_URL + uri, formdata, config);
};
