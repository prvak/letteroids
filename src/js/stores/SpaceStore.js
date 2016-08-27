import events from "events";
import Immutable from "immutable";

import AppDispatcher from "../dispatcher/AppDispatcher";
import ActionConstants from "../constants/ActionConstants";
import SpaceConstants from "../constants/SpaceConstants";
import VectorMath from "../VectorMath";
import Random from "../Random";
import HtmlUtils from "../HtmlUtils";
import HullGenerator from "../HullGenerator";

const EventEmitter = events.EventEmitter;
const random = new Random();
// Name of the event that is emmited on each store change.
const CHANGE_EVENT = "change";
// Key used to store and retrieve hiscore from the local storage.
const KEY_HI_SCORE = "hiScore";

// All objects indexed by object ID.
let _ships = new Immutable.Map({});
let _shots = new Immutable.Map({});
let _asteroids = new Immutable.Map({});
let _junk = new Immutable.Map({});

// Each object has a unique ID. This is incremented each time a new object is created.
let _nextObjectId = 1;
// Timestamp of the last tick event.
let _lastTickTimestamp = null;
// There is one ship. This is its id.
let _shipId = null;
let _isGameStarted = false;
let _isGamePaused = false;
let _isGameOver = false;
let _isGameTerminated = false;
let _score = 0;
let _hiScore = 0;
if (HtmlUtils.isLocalStorageSupported()) {
  _hiScore = HtmlUtils.getFromLocalStorage(KEY_HI_SCORE);
}

// Current size of the space.
const _spaceDimensions = {
  width: SpaceConstants.SPACE_SIZE,
  height: SpaceConstants.SPACE_SIZE,
};

class SpaceStore extends EventEmitter {
  getShips() {
    return _ships;
  }

  getShots() {
    return _shots;
  }

  getAsteroids() {
    return _asteroids;
  }

  getJunk() {
    return _junk;
  }

  /** Width and height of the space in rem units. */
  getDimensions() {
    return _spaceDimensions;
  }

  /** Get current score rounded down to nearest integer. */
  getScore() {
    return Math.floor(_score);
  }

  /** Get hi score from previous games (even if current score is higher). */
  getHiScore() {
    return Math.floor(_hiScore);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  addShip(now, position) {
    const id = `ship_${_nextObjectId++}`;
    const speed = { x: 0, y: 0, r: 0 };
    const hull = HullGenerator.theShip();
    const object = this._createObject(now, id, position, speed, hull, false, 0);
    _ships = _ships.set(id, object);
    _shipId = id;
  }

  addAsteroid(now, scale = 3) {
    const startingConditions = [
      {
        position: { x: 0.5, y: 1.2, r: 0.0 },
        direction: 0.0,
      },
      {
        position: { x: -0.2, y: 0.5, r: 0.0 },
        direction: 0.25,
      },
      {
        position: { x: 0.5, y: -0.2, r: 0.0 },
        direction: 0.5,
      },
      {
        position: { x: 1.2, y: 0.5, r: 0.0 },
        direction: 0.75,
      },
    ];

    const startingCondition = random.choice(startingConditions);
    const randomDirection = SpaceConstants.ASTEROID_DIRECTION * (random.double() - 0.5);
    const randomSpeed = SpaceConstants.ASTEROID_ROTATION_SPEED * (random.double() - 0.5);
    const position = startingCondition.position;
    const direction = startingCondition.direction + randomDirection;
    const rotationSpeed = randomSpeed;
    const force = SpaceConstants.ASTEROID_SPEED / scale;
    const speed = VectorMath.applyForce({ x: 0.0, y: 0.0, r: rotationSpeed }, direction, force);
    const hull = HullGenerator.theRocky();
    this._addAsteroid(now, position, speed, hull, true);
  }

  _addAsteroid(now, position, speed, hull, isNew) {
    const id = `asteroid_${_nextObjectId++}`;
    const object = this._createObject(now, id, position, speed, hull, isNew, 0);
    _asteroids = _asteroids.set(id, object);
  }

  _addJunk(now, position, speed, hull) {
    const id = `junk_${_nextObjectId++}`;
    const object = this._createObject(now, id, position, speed, hull, false,
      SpaceConstants.JUNK_TTL);
    _junk = _junk.set(id, object);
  }

  addShot(now, position, speed, ttl) {
    const id = `shot_${_nextObjectId++}`;
    const hull = HullGenerator.theShot();
    const object = this._createObject(now, id, position, speed, hull, true, ttl);
    _shots = _shots.set(id, object);
  }

  _createObject(now, id, position, speed, hull, isNew, ttl) {
    const force = 0.0;
    const object = Immutable.fromJS({
      id,
      ts: now,
      initialPosition: position,
      initialSpeed: speed,
      position,
      speed,
      force,
      ttl,
      hull,
      isNew,
    });
    return object;
  }

  rotateShip(now, shipId, rotationSpeed) {
    let object = _ships.get(shipId);
    const ts = object.get("ts");
    const duration = (now - ts) / 1000;
    const speed = object.get("initialSpeed").toJS();
    const position = object.get("initialPosition").toJS();
    const force = object.get("force");

    const acceleration = VectorMath.acceleration(position.r, force);
    const rawPosition = VectorMath.currentPosition(position, speed, acceleration, duration);
    const currentPosition = VectorMath.normalizePosition(rawPosition);
    const currentSpeed = VectorMath.currentSpeed(speed, acceleration, duration);
    currentSpeed.r = rotationSpeed;
    object = object.withMutations((o) => {
      const p = new Immutable.Map(currentPosition);
      const s = new Immutable.Map(currentSpeed);
      o.set("initialPosition", p);
      o.set("position", p);
      o.set("initialSpeed", s);
      o.set("speed", s);
      o.set("ts", now);
    });
    _ships = _ships.set(shipId, object);
  }

  accelerateShip(now, shipId, force) {
    let object = _ships.get(shipId);
    const ts = object.get("ts");
    const duration = (now - ts) / 1000;
    const speed = object.get("initialSpeed").toJS();
    const position = object.get("initialPosition").toJS();
    const originalForce = object.get("force");

    const acceleration = VectorMath.acceleration(position.r, originalForce);
    const rawPosition = VectorMath.currentPosition(position, speed, acceleration, duration);
    const currentPosition = VectorMath.normalizePosition(rawPosition);
    const currentSpeed = VectorMath.currentSpeed(speed, acceleration, duration);
    object = object.withMutations((o) => {
      const p = new Immutable.Map(currentPosition);
      const s = new Immutable.Map(currentSpeed);
      o.set("initialPosition", p);
      o.set("position", p);
      o.set("initialSpeed", s);
      o.set("speed", s);
      o.set("force", force);
      o.set("ts", now);
    });
    _ships = _ships.set(shipId, object);
  }

  shoot(now, shipId, force, ttl) {
    const object = _ships.get(shipId);
    const ts = object.get("ts");
    const duration = (now - ts) / 1000;
    const speed = object.get("initialSpeed").toJS();
    const position = object.get("initialPosition").toJS();
    const originalForce = object.get("force");

    // Compute current position so we know from where the shot is actually fired.
    // Also compute current speed so the shot is fired with speed relative to
    // ships speed.
    const acceleration = VectorMath.acceleration(position.r, originalForce);
    const rawPosition = VectorMath.currentPosition(position, speed, acceleration, duration);
    const currentPosition = VectorMath.normalizePosition(rawPosition);
    const currentSpeed = VectorMath.currentSpeed(speed, acceleration, duration);

    // Shoot!
    const shotSpeed = VectorMath.applyForce(currentSpeed, currentPosition.r, force);
    this.addShot(now, currentPosition, shotSpeed, ttl);
    _score += SpaceConstants.SCORE_SHOT;
  }

  _resetTimestamps(now) {
    _lastTickTimestamp = now;
    const reset = (objects) => {
      objects.forEach((object) => {
        const id = object.get("id");
        objects.set(id, object.set("ts", now));
      });
    };
    _ships = _ships.withMutations(reset);
    _asteroids = _asteroids.withMutations(reset);
    _shots = _shots.withMutations(reset);
    _junk = _junk.withMutations(reset);
  }

  _updatePositionsAndSpeeds(now, updateInitialState = false) {
    const update = (objects) => {
      objects.forEach((object) => {
        const ts = object.get("ts");
        const objectId = object.get("id");
        const ttl = object.get("ttl");
        if (ttl && ttl <= (now - ts)) {
          objects.delete(objectId);
        } else {
          const duration = (now - ts) / 1000;
          const speed = object.get("initialSpeed").toJS();
          const position = object.get("initialPosition").toJS();
          const force = object.get("force");

          const acceleration = VectorMath.acceleration(position.r, force);
          const rawPosition = VectorMath.currentPosition(position, speed, acceleration, duration);
          let currentPosition = rawPosition;
          let isNew = object.get("isNew");
          if (isNew) {
            const size = object.get("hull").get("size") / 2;
            const x = rawPosition.x;
            const y = rawPosition.y;
            // New objects are allowed to be behind the edge of the Space. Once such object
            // gets from behind the edge its position will be normalized so it cannot
            // get behind the edge again.
            isNew = x - size < 0.0 || x + size >= 1.0 || y - size <= 0.0 || y + size > 1.0;
          } else {
            currentPosition = VectorMath.normalizePosition(rawPosition);
          }
          const currentSpeed = VectorMath.currentSpeed(speed, acceleration, duration);
          objects.set(objectId, object.withMutations((o) => {
            const p = new Immutable.Map(currentPosition);
            const s = new Immutable.Map(currentSpeed);
            o.set("position", p);
            o.set("speed", s);
            o.set("isNew", isNew);
            if (updateInitialState) {
              o.set("initialPosition", p);
              o.set("initialSpeed", s);
              o.set("ts", now);
              o.set("ttl", ttl > 0 ? ttl - (now - ts) : 0);
            }
          }));
        }
      });
    };
    _ships = _ships.withMutations(update);
    _asteroids = _asteroids.withMutations(update);
    _shots = _shots.withMutations(update);
    _junk = _junk.withMutations(update);
  }

  handleTick(now) {
    if (_lastTickTimestamp === null) {
      this._resetTimestamps(now);
    } else {
      this._updatePositionsAndSpeeds(now);
    }

    _shots.forEach((shot) => {
      const shotPosition = shot.get("position").toJS();
      const shotHull = shot.get("hull");
      const shotSize = shotHull.get("size");
      _asteroids.some((asteroid) => {
        const asteroidPosition = asteroid.get("position").toJS();
        const asteroidHull = asteroid.get("hull");
        const asteroidSize = asteroidHull.get("size");
        if (VectorMath.isCollision(shotPosition, shotSize, asteroidPosition, asteroidSize)) {
          _shots = _shots.delete(shot.get("id"));
          _asteroids = _asteroids.delete(asteroid.get("id"));
          const asteroidParts = asteroidHull.get("parts");
          const asteroidSpeed = asteroid.get("speed");
          if (asteroidParts && asteroidParts.size > 1) {
            this._splitHull(now, asteroidParts, asteroidSize, asteroidPosition,
              asteroidSpeed);
            if (!_isGameOver) {
              // Do not count score after game is over.
              _score += SpaceConstants.SCORE_HIT / asteroidSize;
            }
          } else {
            this._junkHull(now, asteroidPosition, asteroidSpeed, asteroidHull);
          }
          return true;
        }
        return false;
      });
    });

    _ships.forEach((ship) => {
      const shipPosition = ship.get("position").toJS();
      const shipHull = ship.get("hull");
      const shipSize = shipHull.get("size");
      _asteroids.some((asteroid) => {
        const asteroidPosition = asteroid.get("position").toJS();
        const asteroidHull = asteroid.get("hull");
        const asteroidSize = asteroidHull.get("size");
        if (VectorMath.isCollision(shipPosition, shipSize, asteroidPosition, asteroidSize)) {
          _ships = _ships.delete(ship.get("id"));
          const shipSpeed = ship.get("speed");
          this._junkHull(now, shipPosition, shipSpeed, shipHull);
          _isGameOver = true;
          this._saveHiScore();
          return true;
        }
        return false;
      });
    });

    _lastTickTimestamp = now;
  }

  _splitHull(now, parts, size, position, speed) {
    // The asteroid is big enough to be split.
    parts.forEach((part) => {
      const partHull = part.get("hull").toJS();
      const partPosition = part.get("position").toJS();
      const absolutePosition = VectorMath.absolutePosition(position,
        partPosition, size);
      let direction = VectorMath.direction(position, partPosition);
      if (isNaN(direction)) {
        direction = 0.0;
      }
      const force = SpaceConstants.SPLIT_FORCE;
      const partSpeed = VectorMath.applyForce(speed.toJS(), direction, force);
      this._addAsteroid(now, absolutePosition, partSpeed, partHull, false);
    });
  }

  _junkHull(now, position, objectSpeed, objectHull) {
    const hull = objectHull.toJS();
    const speed = objectSpeed.toJS();
    // Create a junk object whose right part will be hidden.
    hull.junk = "left";
    const leftAngle = position.r - SpaceConstants.JUNK_ANGLE;
    const leftSpeed = VectorMath.applyForce(speed, leftAngle, SpaceConstants.JUNK_FORCE);
    this._addJunk(now, position, leftSpeed, hull);
    // Create a junk object whose left part will be hidden.
    hull.junk = "right";
    const rightAngle = position.r + SpaceConstants.JUNK_ANGLE;
    const rightSpeed = VectorMath.applyForce(speed, rightAngle, SpaceConstants.JUNK_FORCE);
    this._addJunk(now, position, rightSpeed, hull);
  }

  startGame(now) {
    _ships = new Immutable.Map({});
    _shots = new Immutable.Map({});
    _asteroids = new Immutable.Map({});
    _junk = new Immutable.Map({});
    _shipId = null;
    _isGameStarted = true;
    _isGamePaused = false;
    _isGameOver = false;
    _isGameTerminated = false;
    _hiScore = this._loadHiScore();
    _score = 0;
    this.addShip(0, { x: 0.5, y: 0.5, r: 0.0 });
    this._resetTimestamps(now);
  }

  isGameStarted() {
    return _isGameStarted;
  }

  pauseGame(now) {
    this._updatePositionsAndSpeeds(now, true);
    this.accelerateShip(now, _shipId, 0.0);
    _isGamePaused = true;
  }

  resumeGame(now) {
    this._resetTimestamps(now);
    _isGamePaused = false;
  }

  isGamePaused() {
    return _isGamePaused;
  }

  isGameOver() {
    return _isGameOver;
  }

  terminateGame() {
    _isGameTerminated = true;
    _isGameStarted = false;
  }

  isGameTerminated() {
    return _isGameTerminated;
  }

  _saveHiScore() {
    if (_score > _hiScore) {
      // Save new hi score but do not update the _hiScore value.
      // It will be updated on restart.
      HtmlUtils.setToLocalStorage(KEY_HI_SCORE, `${_score}`);
    }
  }

  _loadHiScore() {
    let hiScore = 0;
    if (HtmlUtils.isLocalStorageSupported()) {
      hiScore = HtmlUtils.getFromLocalStorage(KEY_HI_SCORE);
    } else if (_score > _hiScore) {
      hiScore = _score;
    }
    return hiScore;
  }
}

const store = new SpaceStore();

// Register callback to handle all updates
AppDispatcher.register((action) => {
  switch (action.actionType) {
    case ActionConstants.OBJECTS_ADD_ASTEROID:
      store.addAsteroid(action.now);
      store.emitChange();
      break;
    case ActionConstants.OBJECTS_ROTATE_SHIP:
      store.rotateShip(action.now, _shipId, action.rotationChange);
      store.emitChange();
      break;
    case ActionConstants.OBJECTS_ACCELERATE_SHIP:
      store.accelerateShip(action.now, _shipId, action.force);
      store.emitChange();
      break;
    case ActionConstants.OBJECTS_SHOOT:
      store.shoot(action.now, _shipId, action.force, action.ttl);
      store.emitChange();
      break;
    case ActionConstants.OBJECTS_TICK:
      store.handleTick(action.now);
      store.emitChange();
      break;
    case ActionConstants.GAME_START:
      store.startGame(action.now);
      store.emitChange();
      break;
    case ActionConstants.GAME_PAUSE:
      store.pauseGame(action.now);
      store.emitChange();
      break;
    case ActionConstants.GAME_RESUME:
      store.resumeGame(action.now);
      store.emitChange();
      break;
    case ActionConstants.GAME_TERMINATE:
      store.terminateGame(action.now);
      store.emitChange();
      break;
    default:
      // no op
  }
});

export default store;
