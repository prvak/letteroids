import AppDispatcher from "../dispatcher/AppDispatcher";
import ObjectsConstants from "../constants/ObjectsConstants";

const SpaceActions = {
  addObject: (position, rotation) => {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_CREATE,
      position,
      rotation,
    });
  },
  rotateObject: (objectId, rotationChange) => {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_ROTATE_ONE,
      objectId,
      rotationChange,
    });
  },
  rotateAllObjects: (rotationChange) => {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_ROTATE,
      rotationChange,
    });
  },
};

export default SpaceActions;
