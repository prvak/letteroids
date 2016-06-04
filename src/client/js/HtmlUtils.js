const HtmlUtils = {
  now() {
    return Date.now();
  },

  isLocalStorageSupported() {
    return window.localStorage !== null;
  },

  setToLocalStorage(key, value) {
    window.localStorage.setItem(key, value);
  },

  getFromLocalStorage(key) {
    return window.localStorage.getItem(key);
  },
};

export default HtmlUtils;
