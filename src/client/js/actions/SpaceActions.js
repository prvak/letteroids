import AppDispatcher from "../dispatcher/AppDispatcher";
import SpaceConstants from "../constants/SpaceConstants";

const SpaceActions = {
  addAsteroid: (now) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.OBJECTS_ADD_ASTEROID,
      now,
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
  pauseGame: (now) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.GAME_PAUSE,
      now,
    });
  },
  resumeGame: (now) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.GAME_RESUME,
      now,
    });
  },
  terminateGame: (now) => {
    AppDispatcher.dispatch({
      actionType: SpaceConstants.GAME_TERMINATE,
      now,
    });
  },
};

export default SpaceActions;
