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
    this._onChange = () => {
      this.setState(getAppState());
    };
    this._onKeyPress = (event) => {
      const shipId = 1;
      switch (event.code) {
        case "ArrowLeft":
          SpaceActions.rotateShip(shipId, -0.05);
          break;
        case "ArrowRight":
          SpaceActions.rotateShip(shipId, 0.05);
          break;
        case "Space":
          SpaceActions.nextTick();
          break;
        default:
          break;
      }
    };
    this._onTick = () => {
      SpaceActions.nextTick();
    };
  }

  componentDidMount() {
    objectsStore.addChangeListener(this._onChange);
    document.addEventListener("keydown", this._onKeyPress);
    setInterval(this._onTick, 1000/30);
  }

  componentWillUnmount() {
    objectsStore.removeChangeListener(this._onChange);
    document.removeEventListener("keydown", this._onKeyPress);
    clearTimeout(this._onTick);
  }

  render() {
    const onKeyPress = this._onKeyPress;
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
