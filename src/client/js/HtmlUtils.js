const HtmlUtils = {
  now() {
    return Date.now();
  },

  isLocalStorageSupported() {
    return window.localStorage !== null;
  },

  setToLocalStorage(key, value) {
    console.log("set", key, value);
    window.localStorage.setItem(key, value);
  },

  getFromLocalStorage(key) {
    const value = window.localStorage.getItem(key);
    console.log("get", key, value);
    return value;
  },
};

export default HtmlUtils;
