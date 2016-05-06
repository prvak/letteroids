import AppDispatcher from "../dispatcher/AppDispatcher";
import ObjectsConstants from "../constants/ObjectsConstants";

const SpaceActions = {
  addObject: (position) => {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_CREATE,
      position,
    });
  },
};

export default SpaceActions;
