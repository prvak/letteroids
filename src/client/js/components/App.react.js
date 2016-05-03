import React from "react";
import objectsStore from "../stores/ObjectsStore.js";

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
      <div>{this.state.objects}</div>
    );
  },

  _onChange: function() {
    this.setState(getTodoState());
  }
});

export default App;
