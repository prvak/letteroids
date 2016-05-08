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
    this._onKeyDown = (event) => {
      const shipId = 1;
      switch (event.code) {
        case "ArrowLeft":
          SpaceActions.rotateShip(shipId, -0.3);
          break;
        case "ArrowRight":
          SpaceActions.rotateShip(shipId, 0.3);
          break;
        case "ArrowUp":
          SpaceActions.accelerateShip(shipId, 0.05);
          break;
        default:
          break;
      }
    };
    this._onKeyUp = (event) => {
      const shipId = 1;
      switch (event.code) {
        case "ArrowLeft":
          SpaceActions.rotateShip(shipId, 0);
          break;
        case "ArrowRight":
          SpaceActions.rotateShip(shipId, 0);
          break;
        case "ArrowUp":
          SpaceActions.accelerateShip(shipId, 0.05);
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
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("keyup", this._onKeyUp);
    setInterval(this._onTick, 1000/30);
  }

  componentWillUnmount() {
    objectsStore.removeChangeListener(this._onChange);
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("keyup", this._onKeyUp);
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
