import React from "react";
import objectsStore from "../stores/ObjectsStore";
import Space from "../components/Space.react";

function getAppState() {
  return {
    ships: objectsStore.getShips(),
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
      <div id="app">
        <Space ships={this.state.ships} />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getAppState());
  },
});

export default App;
