import React from "react";

import Component from "./Component.react";
import SpaceConstants from "../constants/SpaceConstants";

class SpaceObject extends React.Component {
  constructor() {
    super();
    this.state = {
      isSelected: false,
    };
  }

  _createObject(components, size, x, y, rotation, junk, key) {
    let clip = undefined;
    if (junk) {
      if (junk === "left") {
        clip = `rect(0rem, ${size / 2}rem, ${size}rem, 0rem)`;
      } else {
        clip = `rect(0rem, ${size}rem, ${size}rem, ${size / 2}rem)`;
      }
    }

    const style = {
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      width: `${size}rem`,
      height: `${size}rem`,
      marginTop: `${-size / 2}rem`,
      marginLeft: `${-size / 2}rem`,
      transform: `rotate(${rotation}deg)`,
      clip,
    };
    return <span className="object" key={key} style={style}>{components}</span>;
  }

  render() {
    const s = this.props.hull.get("size");
    const x = this.props.position.get("x");
    const y = this.props.position.get("y");
    const r = this.props.position.get("r");
    const junk = this.props.hull.get("junk");

    const size = s * SpaceConstants.SPACE_SIZE;
    const rotation = (r * 360) % 360; // degrees
    const components = [];
    this.props.hull.get("components").forEach((component, index) => {
      components.push(<Component key={index} component={component} />);
    });

    const objects = [];

    // Add real object.
    objects.push(this._createObject(components, size, x, y, rotation, junk, "x"));
    if (this.props.addShadows) {
      // Add shadow objects for each edge that the real object overlaps.
      if (x + s / 2 > 1.0) {
        objects.push(this._createObject(components, size, x - 1.0, y, rotation, junk, "r"));
      }
      if (y + s / 2 > 1.0) {
        objects.push(this._createObject(components, size, x, y - 1.0, rotation, junk, "b"));
      }
      if (x - s / 2 < 0.0) {
        objects.push(this._createObject(components, size, x + 1.0, y, rotation, junk, "l"));
      }
      if (y - s / 2 < 0.0) {
        objects.push(this._createObject(components, size, x, y + 1.0, rotation, junk, "t"));
      }
    }
    return <span>{objects}</span>;
  }
}

SpaceObject.propTypes = {
  position: React.PropTypes.object.isRequired,
  hull: React.PropTypes.object.isRequired,
  addShadows: React.PropTypes.bool.isRequired,
};

export default SpaceObject;
