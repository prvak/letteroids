import AppDispatcher from "../dispatcher/AppDispatcher";
import ObjectsConstants from "../constants/ObjectsConstants";

const SpaceActions = {
  addObject: function(position) {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_CREATE,
      position: position,
    });
  },
};

export default SpaceActions;
