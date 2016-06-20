import AppDispatcher from "../dispatcher/AppDispatcher";
import ActionConstants from "../constants/ActionConstants";

const SpaceActions = {
  addAsteroid: (now) => {
    AppDispatcher.dispatch({
      actionType: ActionConstants.OBJECTS_ADD_ASTEROID,
      now,
    });
  },
  rotateShip: (now, objectId, rotationChange) => {
    AppDispatcher.dispatch({
      actionType: ActionConstants.OBJECTS_ROTATE_SHIP,
      now,
      objectId,
      rotationChange,
    });
  },
  accelerateShip: (now, objectId, force) => {
    AppDispatcher.dispatch({
      actionType: ActionConstants.OBJECTS_ACCELERATE_SHIP,
      now,
      objectId,
      force,
    });
  },
  shoot: (now, force, ttl) => {
    AppDispatcher.dispatch({
      actionType: ActionConstants.OBJECTS_SHOOT,
      now,
      force,
      ttl,
    });
  },
  nextTick: (now) => {
    AppDispatcher.dispatch({
      actionType: ActionConstants.OBJECTS_TICK,
      now,
    });
  },
  startGame: (now) => {
    AppDispatcher.dispatch({
      actionType: ActionConstants.GAME_START,
      now,
    });
  },
  pauseGame: (now) => {
    AppDispatcher.dispatch({
      actionType: ActionConstants.GAME_PAUSE,
      now,
    });
  },
  resumeGame: (now) => {
    AppDispatcher.dispatch({
      actionType: ActionConstants.GAME_RESUME,
      now,
    });
  },
  terminateGame: (now) => {
    AppDispatcher.dispatch({
      actionType: ActionConstants.GAME_TERMINATE,
      now,
    });
  },
};

export default SpaceActions;
