import events from "events";
import Immutable from "immutable";

import AppDispatcher from "../dispatcher/AppDispatcher";
import SpaceConstants from "../constants/SpaceConstants";
import VectorMath from "../VectorMath";
import Random from "../Random";

const EventEmitter = events.EventEmitter;
const CHANGE_EVENT = "change";
const random = new Random();
const ASTEROID_SYMBOLS = ["@", "#", "$"];

// All objects indexed by object ID.
let _ships = new Immutable.Map({});
let _shots = new Immutable.Map({});
let _asteroids = new Immutable.Map({});

// Each object has a unique ID. This is incremented each time a new object is created.
let _nextObjectId = 1;
// Timestamp of the last tick event.
let _lastTickTimestamp = null;
// There is one ship. This is its id.
let _shipId = null;
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

  /** Width and height of the space in rem units. */
  getDimensions() {
    return _spaceDimensions;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  /**
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  addShip(now, position) {
    const id = `ship_${_nextObjectId++}`;
    const speed = { x: 0, y: 0, r: 0 };
    const hull = {
      size: 0.02,
      components: [
        {
          symbol: "V",
          position: { x: 0.5, y: 0.5, r: 0.5 },
          size: 0.02,
        },
      ],
    };
    const object = this._createObject(now, id, position, speed, hull, false, 0);
    _ships = _ships.set(id, object);
    _shipId = id;
  }

  addAsteroid(now, scale = 3) {
    const baseSize = 0.04;
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
    const position = startingCondition.position;
    const direction = startingCondition.direction + 0.05 * (random.random() - 0.5);
    const rotationSpeed = (random.random() - 0.5) * 0.1;
    const force = 0.3 / scale;
    const speed = VectorMath.applyForce({ x: 0.0, y: 0.0, r: rotationSpeed }, direction, force);
    const hull = {
      size: baseSize * Math.pow(2, scale),
      components: this._generateAsteroidComponents(scale, baseSize),
    };
    this._addAsteroid(now, position, speed, hull, true);
  }

  _addAsteroid(now, position, speed, hull, isNew) {
    const id = `asteroid_${_nextObjectId++}`;
    const object = this._createObject(now, id, position, speed, hull, isNew, 0);
    _asteroids = _asteroids.set(id, object);
  }

  _generateAsteroidComponents(depth, baseSize) {
    const count = 4;
    const generatePosition = (index) => {
      const rotation = random.random();
      let position = null;
      if (index === 0) {
        position = { x: 0.25, y: 0.5, r: rotation };
      } else if (index === 1) {
        position = { x: 0.75, y: 0.5, r: rotation };
      } else if (index === 2) {
        position = { x: 0.5, y: 0.75, r: rotation };
      } else if (index === 3) {
        position = { x: 0.5, y: 0.25, r: rotation };
      }
      return position;
    };

    const components = [];
    for (let i = 0; i < count; i++) {
      const position = generatePosition(i);
      if (depth === 1) {
        const symbol = random.choice(ASTEROID_SYMBOLS);
        // Scale 0.8 - 1.2 of base size.
        const size = baseSize * (random.random() * 0.4 + 0.8);
        components.push({ symbol, position, size });
      } else {
        const subcomponents = this._generateAsteroidComponents(depth - 1, baseSize);
        const size = baseSize * Math.pow(2, depth - 1);
        components.push({ components: subcomponents, position, size });
      }
    }
    return components;
  }

  addShot(now, position, speed, ttl) {
    const id = `shot_${_nextObjectId++}`;
    const hull = {
      size: 0.006,
      components: [
        {
          symbol: "x",
          position: { x: 0.5, y: 0.5, r: 0.5 },
          size: 0.006,
        },
      ],
    };
    const object = this._createObject(now, id, position, speed, hull, true, ttl);
    _shots = _shots.set(id, object);
  }

  _createObject(now, id, position, speed, hull, isNew, ttl) {
    const force = 0.0;
    const expiresAt = ttl ? now + ttl : 0;
    const object = Immutable.fromJS({
      id,
      ts: now,
      initialPosition: position,
      initialSpeed: speed,
      position,
      speed,
      force,
      expiresAt,
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
  }

  _updatePositionsAndSpeeds(now) {
    const update = (objects) => {
      objects.forEach((object) => {
        const objectId = object.get("id");
        const expires = object.get("expiresAt");
        if (expires && expires < now) {
          objects.delete(objectId);
        } else {
          const ts = object.get("ts");
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
            o.set("position", new Immutable.Map(currentPosition));
            o.set("speed", new Immutable.Map(currentSpeed));
            o.set("isNew", isNew);
          }));
        }
      });
    };
    _ships = _ships.withMutations(update);
    _asteroids = _asteroids.withMutations(update);
    _shots = _shots.withMutations(update);
  }

  handleTick(now) {
    if (_lastTickTimestamp === null) {
      this._resetTimestamps(now);
    } else {
      this._updatePositionsAndSpeeds(now);
    }

    _shots.forEach((shot) => {
      const shotPosition = shot.get("position");
      const shotSize = shot.get("hull").get("size");
      _asteroids.some((asteroid) => {
        const asteroidPosition = asteroid.get("position");
        const asteroidSize = asteroid.get("hull").get("size");
        const dx = asteroidPosition.get("x") - shotPosition.get("x");
        const dy = asteroidPosition.get("y") - shotPosition.get("y");
        const distance = Math.sqrt(dx * dx + dy * dy);
        const collisionDistance = (asteroidSize + shotSize) / 2;
        if (distance < collisionDistance) {
          _shots = _shots.delete(shot.get("id"));
          _asteroids = _asteroids.delete(asteroid.get("id"));
          const components = asteroid.get("hull").get("components");
          if (components.size > 1) {
            // The asteroid is big enough to be split.
            components.forEach((component) => {
              const subcomponents = component.get("components");
              const componentSize = component.get("size");
              let hull = null;
              if (subcomponents) {
                hull = {
                  size: componentSize,
                  components: subcomponents.toJS(),
                };
              } else {
                hull = {
                  size: componentSize,
                  components: [component.toJS()],
                };
                hull.components[0].position.x = 0.5;
                hull.components[0].position.y = 0.5;
                hull.components[0].position.r = 0.0;
              }
              const x = (component.get("position").get("x") - 0.5) * asteroidSize;
              const y = (component.get("position").get("y") - 0.5) * asteroidSize;
              const angle = asteroidPosition.get("r") * 2 * Math.PI;
              const position = {
                x: (x * Math.cos(angle) - y * Math.sin(angle)) + asteroidPosition.get("x"),
                y: (x * Math.sin(angle) + y * Math.cos(angle)) + asteroidPosition.get("y"),
                r: (component.get("position").get("r") + asteroidPosition.get("r")) % 1.0,
              };
              const force = 0.1;
              let direction = VectorMath.direction(asteroidPosition.toJS(), position);
              if (isNaN(direction)) {
                console.log("Warning: Direction is 'NaN'. Replacing with '0.0'.");
                direction = 0.0;
              }
              const speed = VectorMath.applyForce(asteroid.get("speed").toJS(), direction, force);
              this._addAsteroid(now, position, speed, hull, false);
            });
          }
          return true;
        }
        return false;
      });
    });
    _lastTickTimestamp = now;
  }
}

const store = new SpaceStore();
store.addShip(0, { x: 0.5, y: 0.5, r: 0.0 });

// Register callback to handle all updates
AppDispatcher.register((action) => {
  switch (action.actionType) {
    case SpaceConstants.OBJECTS_ADD_ASTEROID:
      store.addAsteroid(action.now);
      store.emitChange();
      break;
    case SpaceConstants.OBJECTS_ROTATE_SHIP:
      store.rotateShip(action.now, _shipId, action.rotationChange);
      store.emitChange();
      break;
    case SpaceConstants.OBJECTS_ACCELERATE_SHIP:
      store.accelerateShip(action.now, _shipId, action.force);
      store.emitChange();
      break;
    case SpaceConstants.OBJECTS_SHOOT:
      store.shoot(action.now, _shipId, action.force, action.ttl);
      store.emitChange();
      break;
    case SpaceConstants.OBJECTS_TICK:
      store.handleTick(action.now);
      store.emitChange();
      break;
    default:
      // no op
  }
});

export default store;
