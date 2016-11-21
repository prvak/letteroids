import ReactGA from "react-ga";
ReactGA.initialize("UA-1851754-4");

class Analytics {
  logPageView() {
    const page = window.location.pathname;
    ReactGA.set({ page });
    ReactGA.pageview(page);
  }
}

const analytics = new Analytics();
export default analytics;
