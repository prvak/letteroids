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
};

export default SpaceActions;
