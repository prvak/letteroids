import React from "react";
import ReactDom from "react-dom";
import App from "./components/App.react";

console.log(ReactDom);
ReactDom.render(
  <App />,
  document.getElementById('app')
);
