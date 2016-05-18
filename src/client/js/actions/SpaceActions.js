import AppDispatcher from "../dispatcher/AppDispatcher";
import SpaceConstants from "../constants/SpaceConstants";

const SpaceActions = {
  addAsteroid: (now, position, speed) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_ADD_ASTEROID,
      now,
      position,
      speed,
    });
  },
  rotateShip: (now, objectId, rotationChange) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_ROTATE_SHIP,
      now,
      objectId,
      rotationChange,
    });
  },
  accelerateShip: (now, objectId, force) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_ACCELERATE_SHIP,
      now,
      objectId,
      force,
    });
  },
  shoot: (now, force, ttl) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_SHOOT,
      now,
      force,
      ttl,
    });
  },
  nextTick: (now) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_TICK,
      now,
    });
  },
};

export default SpaceActions;
