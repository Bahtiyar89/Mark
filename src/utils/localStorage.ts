export const getItemFromStorage = (key: any) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }

  return null;
};

export const setItemToStorage = (key: any, value: any) => {
  if (typeof window !== undefined) {
    localStorage.setItem(key, value);
  }
};

export const removeItemFromStorage = (key: any) => {
  if (typeof window !== undefined) {
    localStorage.removeItem(key);
  }
};
