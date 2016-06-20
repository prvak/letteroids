import React from "react";

import objectsStore from "../stores/SpaceStore";
import Space from "../components/Space.react";
import GamePausedBox from "../components/GamePausedBox.react";
import GameOverBox from "../components/GameOverBox.react";
import ScoreBox from "../components/ScoreBox.react";
import SpaceActions from "../actions/SpaceActions";
import SpaceConstants from "../constants/SpaceConstants";
import HtmlUtils from "../HtmlUtils";
import Random from "../Random";

function getAppState() {
  return {
    ships: objectsStore.getShips(),
    shots: objectsStore.getShots(),
    asteroids: objectsStore.getAsteroids(),
    junk: objectsStore.getJunk(),
    dimensions: objectsStore.getDimensions(),
    score: objectsStore.getScore(),
    hiScore: objectsStore.getHiScore(),
    isGamePaused: objectsStore.isGamePaused(),
    isGameOver: objectsStore.isGameOver(),
    isGameTerminated: objectsStore.isGameTerminated(),
  };
}

class App extends React.Component {
  constructor() {
    super();
    this.random = new Random();
    this.state = getAppState();
    this._lastShotTs = HtmlUtils.now();
    this._onChange = () => {
      this.setState(getAppState());
      if (!this._isGameActive()) {
        if (this.state.isGamePaused) {
          this._stopTickTimer();
          this._stopAsteroidTimer();
        }
        if (this.state.isGameOver) {
          this._startTerminationTimer();
          this._stopAsteroidTimer();
          this._sinceLastAsteroid = 0;
        }
        this._stopShootTimer();
      } else {
        this._startTickTimer();
        this._startAsteroidTimer();
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
            if (this.state.isGameTerminated) {
              SpaceActions.startGame(HtmlUtils.now());
              this._terminationTimer = null;
            } else if (this.state.isGamePaused) {
              SpaceActions.resumeGame(now);
            }
            return;
        }
      }
      switch (event.code) {
        case "ArrowLeft":
          SpaceActions.rotateShip(now, shipId, -SpaceConstants.SHIP_ROTATION_SPEED);
          break;
        case "ArrowRight":
          SpaceActions.rotateShip(now, shipId, SpaceConstants.SHIP_ROTATION_SPEED);
          break;
        case "ArrowUp":
          SpaceActions.accelerateShip(now, shipId, SpaceConstants.SHIP_ACCELERATION);
          break;
        case "Space":
          if (!this._shootTimer) {
            const sinceLastShot = now - this._lastShotTs;
            const minSinceLastShot = 1000 / SpaceConstants.SHIP_SHOOTING_SPEED;
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
    this._onAsteroid = () => {
      const now = HtmlUtils.now();
      const addAsteroid = () => {
        this._lastAsteroidTs = now;
        this._sinceLastAsteroid = 0;
        this._asteroidChance = 0;
        SpaceActions.addAsteroid(now);
      };
      const computeAsteroidChance = () => {
        this._sinceLastAsteroid = now - this._lastAsteroidTs;
        let chance = this._sinceLastAsteroid * SpaceConstants.ASTEROID_PROBABILITY;
        chance /= this.state.asteroids.size;
        console.log(chance);
        return chance;
      };

      if (this.state.asteroids.size <= 0) {
        // Player is bored there is nothing to shoot at.
        addAsteroid();
      } else if (this.random.double() < computeAsteroidChance()) {
        // Bad luck. New asteroid will be created.
        addAsteroid();
      }
    };
    this._onShoot = () => {
      const now = HtmlUtils.now();
      this._startShootTimer();
      this._lastShotTs = now;
      SpaceActions.shoot(now, SpaceConstants.SHOT_SPEED, SpaceConstants.SHOT_TTL);
    };
    this._onGameTerminated = () => {
      const now = HtmlUtils.now();
      SpaceActions.terminateGame(now);
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
    SpaceActions.startGame(HtmlUtils.now());
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
    return !this.state.isGamePaused
      && !this.state.isGameOver
      && !this.state.isGameTerminated;
  }

  _startTickTimer() {
    if (!this._tickTimer) {
      this._tickTimer = setInterval(this._onTick, 1000 / SpaceConstants.FPS);
    }
  }

  _stopTickTimer() {
    if (this._tickTimer) {
      clearInterval(this._tickTimer);
      this._tickTimer = null;
    }
  }

  _startAsteroidTimer() {
    if (!this._asteroidTimer) {
      const now = HtmlUtils.now();
      this._lastAsteroidTs = now - this._sinceLastAsteroid; // restore value before pause
      this._asteroidTimer = setInterval(this._onAsteroid, 1000 / SpaceConstants.ASTEROID_FREQUENCY);
    }
  }

  _stopAsteroidTimer() {
    if (this._asteroidTimer) {
      const now = HtmlUtils.now();
      this._sinceLastAsteroid = now - this._lastAsteroidTs; // save for later
      clearInterval(this._asteroidTimer);
      this._asteroidTimer = null;
    }
  }

  _startShootTimer() {
    this._shootTimer = setTimeout(this._onShoot, 1000 / SpaceConstants.SHIP_SHOOTING_SPEED);
  }

  _stopShootTimer() {
    if (this._shootTimer) {
      clearTimeout(this._shootTimer);
      this._shootTimer = null;
    }
  }

  _startTerminationTimer() {
    if (!this._terminationTimer) {
      this._terminationTimer = setTimeout(this._onGameTerminated, 1500);
    }
  }

  render() {
    const space = (<Space
      ships={this.state.ships}
      shots={this.state.shots}
      asteroids={this.state.asteroids}
      junk={this.state.junk}
    />);
    const style = {
      width: `${this.state.dimensions.width}rem`,
      height: `${this.state.dimensions.height}rem`,
    };

    const score = <ScoreBox score={this.state.score} />;
    if (this.state.isGameTerminated) {
      const message = <GameOverBox score={this.state.score} hiScore={this.state.hiScore} />;
      return <div id="app" style={style}>{space} {score} {message}</div>;
    } else if (this.state.isGamePaused) {
      const message = <GamePausedBox />;
      return <div id="app" style={style}>{space} {score} {message}</div>;
    }
    return <div id="app" style={style}>{space} {score}</div>;
  }
}

export default App;
