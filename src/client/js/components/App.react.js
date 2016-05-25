import React from "react";

import objectsStore from "../stores/SpaceStore";
import Space from "../components/Space.react";
import MessageBox from "../components/MessageBox.react";
import SpaceActions from "../actions/SpaceActions";
import SpaceConstants from "../constants/SpaceConstants";
import HtmlUtils from "../HtmlUtils";

function getAppState() {
  return {
    ships: objectsStore.getShips(),
    shots: objectsStore.getShots(),
    asteroids: objectsStore.getAsteroids(),
    junk: objectsStore.getJunk(),
    dimensions: objectsStore.getDimensions(),
    isGamePaused: objectsStore.isGamePaused(),
  };
}

// Rotation speed in full rotations per second.
const SHIP_ROTATION_SPEED = 0.6;
// Acceleration in screens per second^2.
const SHIP_ACCELERATION = 0.3;
// Number of shots fired per second.
const SHIP_SHOOTING_SPEED = 10;
const FPS = 30;
const SHOT_TTL = 3000;

class App extends React.Component {
  constructor() {
    super();
    this.state = getAppState();
    this._lastShotTs = HtmlUtils.now();
    this._onChange = () => {
      this.setState(getAppState());
      if (this.state.isGamePaused) {
        this._stopTickTimer();
        this._stopShootTimer();
      } else {
        this._startTickTimer();
      }
    };
    this._onKeyDown = (event) => {
      const now = HtmlUtils.now();
      const shipId = 1;
      if (!this._isGameActive()) {
        switch (event.code) {
          case "OSLeft":
          case "OSRight":
          case "AltLeft":
          case "AltRight":
          case "ControlLeft":
          case "ControlRight":
            // Ignore control keys.
            return;
          default:
            SpaceActions.resumeGame(now);
            return;
        }
      }
      switch (event.code) {
        case "ArrowLeft":
          SpaceActions.rotateShip(now, shipId, -SHIP_ROTATION_SPEED);
          break;
        case "ArrowRight":
          SpaceActions.rotateShip(now, shipId, SHIP_ROTATION_SPEED);
          break;
        case "ArrowUp":
          SpaceActions.accelerateShip(now, shipId, SHIP_ACCELERATION);
          break;
        case "Space":
          if (!this._shootTimer) {
            const sinceLastShot = now - this._lastShotTs;
            const minSinceLastShot = 1000 / SHIP_SHOOTING_SPEED;
            if (sinceLastShot >= minSinceLastShot) {
              this._onShoot();
            } else {
              this._shootTimer = setTimeout(this._onShoot, minSinceLastShot - sinceLastShot);
            }
          }
          break;
        case "KeyA":
          SpaceActions.addAsteroid(now);
          break;
        case "KeyP":
        case "Pause":
          SpaceActions.pauseGame(now);
          break;
        default:
          break;
      }
    };
    this._onKeyUp = (event) => {
      const now = HtmlUtils.now();
      const shipId = 1;
      if (!this._isGameActive()) {
        return;
      }
      switch (event.code) {
        case "ArrowLeft":
          SpaceActions.rotateShip(now, shipId, 0);
          break;
        case "ArrowRight":
          SpaceActions.rotateShip(now, shipId, 0);
          break;
        case "ArrowUp":
          SpaceActions.accelerateShip(now, shipId, 0);
          break;
        case "Space":
          this._stopShootTimer();
          break;
        default:
          break;
      }
    };
    this._onTick = () => {
      const now = HtmlUtils.now();
      SpaceActions.nextTick(now);
    };
    this._onShoot = () => {
      const now = HtmlUtils.now();
      this._startShootTimer();
      this._lastShotTs = now;
      SpaceActions.shoot(now, 0.3, SHOT_TTL);
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
    this._startTickTimer();
    this._onResize();
  }

  componentWillUnmount() {
    objectsStore.removeChangeListener(this._onChange);
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("keyup", this._onKeyUp);
    window.removeEventListener("resize", this._onResize);
    this._stopTickTimer();
  }

  _isGameActive() {
    return !this.state.isGamePaused;
  }

  _startTickTimer() {
    if (!this._tickTimer) {
      this._tickTimer = setInterval(this._onTick, 1000 / FPS);
    }
  }

  _stopTickTimer() {
    if (this._tickTimer) {
      clearInterval(this._tickTimer);
      this._tickTimer = null;
    }
  }

  _startShootTimer() {
    this._shootTimer = setTimeout(this._onShoot, 1000 / SHIP_SHOOTING_SPEED);
  }

  _stopShootTimer() {
    if (this._shootTimer) {
      clearTimeout(this._shootTimer);
      this._shootTimer = null;
    }
  }

  render() {
    const space = (<Space
      ships={this.state.ships}
      shots={this.state.shots}
      asteroids={this.state.asteroids}
      junk={this.state.junk}
      dimensions={this.state.dimensions}
    />);

    if (this.state.isGamePaused) {
      const message = <MessageBox title="Paused" message="Press any key to continue." />;
      return <div id="app">{space} {message}</div>;
    }
    return <div id="app">{space}</div>;
  }
}

export default App;
