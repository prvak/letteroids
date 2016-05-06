import React from "react";
import objectsStore from "../stores/ObjectsStore";
import Space from "../components/Space.react";

function getAppState() {
  return {
    ships: objectsStore.getShips(),
  };
}

class App extends React.Component {
  getInitialState() {
    return getAppState();
  }

  componentDidMount() {
    objectsStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    objectsStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(getAppState());
  }

  render() {
    return (
      <div id="app">
        <Space ships={this.state.ships} />
      </div>
    );
  }
}

export default App;
