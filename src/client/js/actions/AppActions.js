import AppDispatcher from "../dispatcher/AppDispatcher";
import ObjectsConstants from "../constants/ObjectsConstants";

const AppActions = {
  /**
   * @param  {string} text
   */
  increase: function() {
    AppDispatcher.dispatch({
      actionType: ObjectsConstants.OBJECTS_CREATE,
    });
  },
};

export default AppActions;
