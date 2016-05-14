import React from "react";
import objectsStore from "../stores/SpaceStore";
import Space from "../components/Space.react";
import SpaceActions from "../actions/SpaceActions";
import SpaceConstants from "../constants/SpaceConstants";

function getAppState() {
  return {
    ships: objectsStore.getShips(),
    shots: objectsStore.getShots(),
    asteroids: objectsStore.getAsteroids(),
    dimensions: objectsStore.getDimensions(),
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
      SpaceActions.shoot(0.05, 3000);
    };
    this._onResize = () => {
      const w = window;
      const d = document;
      const e = d.documentElement;
      const g = d.getElementsByTagName("body")[0];
      const width = w.innerWidth || e.clientWidth || g.clientWidth;
      const height = w.innerHeight || e.clientHeight || g.clientHeight;
      const unit = Math.min(width, height) / SpaceConstants.SPACE_SIZE;
      document.getElementsByTagName("html")[0].style["font-size"] = `${unit}px`;
    };
  }

  componentDidMount() {
    objectsStore.addChangeListener(this._onChange);
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("keyup", this._onKeyUp);
    window.addEventListener("resize", this._onResize);
    this._tickTimer = setInterval(this._onTick, 1000 / 30);
    this._onResize();
  }

  componentWillUnmount() {
    objectsStore.removeChangeListener(this._onChange);
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("keyup", this._onKeyUp);
    window.removeEventListener("resize", this._onResize);
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
          dimensions={this.state.dimensions}
        />
      </div>
    );
  }
}

export default App;
