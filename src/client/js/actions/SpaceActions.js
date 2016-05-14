import AppDispatcher from "../dispatcher/AppDispatcher";
import SpaceConstants from "../constants/SpaceConstants";

const SpaceActions = {
  addAsteroid: (position, speed) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_ADD_ASTEROID,
      position,
      speed,
    });
  },
  rotateShip: (objectId, rotationChange) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_ROTATE_SHIP,
      objectId,
      rotationChange,
    });
  },
  accelerateShip: (objectId, force) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_ACCELERATE_SHIP,
      objectId,
      force,
    });
  },
  shoot: (force, ttl) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_SHOOT,
      force,
      ttl,
    });
  },
  nextTick: () => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_TICK,
    });
  },
};

export default SpaceActions;
