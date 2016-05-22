import React from "react";

import objectsStore from "../stores/SpaceStore";
import SpaceActions from "../actions/SpaceActions";
import SpaceObject from "../components/SpaceObject.react";
import HtmlUtils from "../HtmlUtils";

class Space extends React.Component {
  constructor() {
    super();
    this.state = {
      ships: objectsStore.getShips(),
    };

    this._onClick = (event) => {
      const now = HtmlUtils.now();
      const position = this._relativeMousePosition(event);
      position.r = 0; // degrees
      SpaceActions.addAsteroid(now);
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

  _relativeMousePosition(event) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let canvasX = 0;
    let canvasY = 0;
    let currentElement = event.currentTarget;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
      currentElement = currentElement.offsetParent;
    } while (currentElement);

    canvasX = (event.pageX - totalOffsetX) / event.currentTarget.clientWidth;
    canvasY = (event.pageY - totalOffsetY) / event.currentTarget.clientHeight;

    return { x: canvasX, y: canvasY };
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
    const style = {
      width: `${this.props.dimensions.width}rem`,
      height: `${this.props.dimensions.height}rem`,
    };
    return (
      <div
        className="space"
        onClick={this._onClick}
        style={style}
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
  dimensions: React.PropTypes.object.isRequired,
};

export default Space;
