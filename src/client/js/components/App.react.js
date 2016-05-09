import React from "react";
import objectsStore from "../stores/ObjectsStore";
import Space from "../components/Space.react";
import SpaceActions from "../actions/SpaceActions";

function getAppState() {
  return {
    ships: objectsStore.getShips(),
    shots: objectsStore.getShots(),
    asteroids: objectsStore.getAsteroids(),
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
          SpaceActions.rotateShip(shipId, -0.6);
          break;
        case "ArrowRight":
          SpaceActions.rotateShip(shipId, 0.6);
          break;
        case "ArrowUp":
          SpaceActions.accelerateShip(shipId, 0.3);
          break;
        case "Space":
          if (!this._shootTimer) {
            this._onShoot();
            this._shootTimer = setInterval(this._onShoot, 500);
          }
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
          SpaceActions.accelerateShip(shipId, 0);
          break;
        case "Space":
          if (this._shootTimer) {
            clearInterval(this._shootTimer);
            this._shootTimer = null;
          }
          break;
        default:
          break;
      }
    };
    this._onTick = () => {
      SpaceActions.nextTick();
    };
    this._onShoot = () => {
      SpaceActions.shoot(0.3, 3000);
    };
  }

  componentDidMount() {
    objectsStore.addChangeListener(this._onChange);
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("keyup", this._onKeyUp);
    this._tickTimer = setInterval(this._onTick, 1000 / 30);
  }

  componentWillUnmount() {
    objectsStore.removeChangeListener(this._onChange);
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("keyup", this._onKeyUp);
    if (this._tickTimer) {
      clearInterval(this._tickTimer);
    }
  }

  render() {
    return (
      <div id="app">
        <Space
          ships={this.state.ships}
          shots={this.state.shots}
          asteroids={this.state.asteroids}
        />
      </div>
    );
  }
}

export default App;
