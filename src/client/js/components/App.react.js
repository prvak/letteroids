import React from "react";

import objectsStore from "../stores/SpaceStore";
import Space from "../components/Space.react";
import SpaceActions from "../actions/SpaceActions";
import SpaceConstants from "../constants/SpaceConstants";
import HtmlUtils from "../HtmlUtils";

function getAppState() {
  return {
    ships: objectsStore.getShips(),
    shots: objectsStore.getShots(),
    asteroids: objectsStore.getAsteroids(),
    dimensions: objectsStore.getDimensions(),
  };
}

// Rotation speed in full rotations per second.
const SHIP_ROTATION_SPEED = 0.6;
// Acceleration in screens per second^2.
const SHIP_ACCELERATION = 0.3;
// Number of shots fired per second.
const SHIP_SHOOTING_SPEED = 10;

class App extends React.Component {
  constructor() {
    super();
    this.state = getAppState();
    this._lastShotTs = HtmlUtils.now();
    this._onChange = () => {
      this.setState(getAppState());
    };
    this._onKeyDown = (event) => {
      const shipId = 1;
      switch (event.code) {
        case "ArrowLeft":
          SpaceActions.rotateShip(shipId, -SHIP_ROTATION_SPEED);
          break;
        case "ArrowRight":
          SpaceActions.rotateShip(shipId, SHIP_ROTATION_SPEED);
          break;
        case "ArrowUp":
          SpaceActions.accelerateShip(shipId, SHIP_ACCELERATION);
          break;
        case "Space":
          if (!this._shootTimer) {
            const now = HtmlUtils.now();
            const sinceLastShot = now - this._lastShotTs;
            const minSinceLastShot = 1000 / SHIP_SHOOTING_SPEED;
            if (sinceLastShot >= minSinceLastShot) {
              this._onShoot();
            } else {
              this._shootTimer = setTimeout(this._onShoot, minSinceLastShot - sinceLastShot);
            }
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
            clearTimeout(this._shootTimer);
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
      this._shootTimer = setTimeout(this._onShoot, 1000 / SHIP_SHOOTING_SPEED);
      this._lastShotTs = Date.now();
      SpaceActions.shoot(0.3, 3000);
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
