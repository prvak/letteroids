import React from "react";

import objectsStore from "../stores/SpaceStore";
import SpaceObject from "../components/SpaceObject.react";

class Space extends React.Component {
  constructor() {
    super();
    this.state = {
      ships: objectsStore.getShips(),
    };
    this._onChange = () => {
      return {
        ships: objectsStore.getShips(),
      };
    };
  }

  componentDidMount() {
    objectsStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    objectsStore.removeChangeListener(this._onChange);
  }

  _renderObject(object) {
    return (<SpaceObject
      position={object.get("position")}
      hull={object.get("hull")}
      addShadows={!object.get("isNew")}
      key={object.get("id")}
    />);
  }

  render() {
    const objects = [];
    this.props.ships.forEach((object) => {
      objects.push(this._renderObject(object));
    });
    this.props.shots.forEach((object) => {
      objects.push(this._renderObject(object));
    });
    this.props.asteroids.forEach((object) => {
      objects.push(this._renderObject(object));
    });
    this.props.junk.forEach((object) => {
      objects.push(this._renderObject(object));
    });
    return (
      <div
        className="space"
        onClick={this._onClick}
      >
        {objects}
      </div>
    );
  }
}

Space.propTypes = {
  ships: React.PropTypes.object.isRequired,
  shots: React.PropTypes.object.isRequired,
  asteroids: React.PropTypes.object.isRequired,
  junk: React.PropTypes.object.isRequired,
};

export default Space;
