import AppDispatcher from "../dispatcher/AppDispatcher";
import ObjectsConstants from "../constants/ObjectsConstants";

const SpaceActions = {
  addAsteroid: (position, speed) => {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_ADD_ASTEROID,
      position,
      speed,
    });
  },
  rotateShip: (objectId, rotationChange) => {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_ROTATE_SHIP,
      objectId,
      rotationChange,
    });
  },
  accelerateShip: (objectId, force) => {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_ACCELERATE_SHIP,
      objectId,
      force,
    });
  },
  shoot: (force, ttl) => {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_SHOOT,
      force,
      ttl,
    });
  },
  nextTick: () => {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_TICK,
    });
  },
};

export default SpaceActions;
