import React from "react";
import objectsStore from "../stores/ObjectsStore.js";
import AppActions from "../actions/AppActions.js";

function getAppState() {
  return {
    objects: objectsStore.getAll(),
  };
}

const App = React.createClass({
  getInitialState: function() {
    return getAppState();
  },

  componentDidMount: function() {
    objectsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    objectsStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div onClick={this._onClick}>{this.state.objects}</div>
    );
  },

  _onChange: function() {
    this.setState(getAppState());
  },

  _onClick: function() {
    AppActions.increase();
  }
});

export default App;
