import React from "react";
import objectsStore from "../stores/ObjectsStore";
import Space from "../components/Space.react";
import SpaceActions from "../actions/SpaceActions";

function getAppState() {
  return {
    ships: objectsStore.getShips(),
  };
}

class App extends React.Component {
  constructor() {
    super();
    this.state = getAppState();
  }

  componentDidMount() {
    objectsStore.addChangeListener(this._onChange.bind(this));
    document.addEventListener("keydown", this._onKeyPress.bind(this));
  }

  componentWillUnmount() {
    objectsStore.removeChangeListener(this._onChange.bind(this));
    document.removeEventListener("keydown", this._onKeyPress.bind(this));
  }

  _onChange() {
    this.setState(getAppState());
  }

  _onKeyPress(event) {
    switch (event.code) {
      case "ArrowLeft":
        SpaceActions.rotateAllObjects(-5);
        break;
      case "ArrowRight":
        SpaceActions.rotateAllObjects(5);
        break;
      default:
        break;
    }
  }

  render() {
    const onKeyPress = this._onKeyPress.bind();
    return (
      <div id="app"
        onKeyPress={onKeyPress}
      >
        <Space ships={this.state.ships} />
      </div>
    );
  }
}

export default App;
