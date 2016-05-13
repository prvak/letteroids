import React from "react";

import Component from "./Component.react"

class SpaceObject extends React.Component {
  constructor() {
    super();
    this.state = {
      isSelected: false,
    };
  }

  _onClick(event) {
    event.stopPropagation();
    const newState = {
      isSelected: !this.state.isSelected,
    };
    this.setState(newState);
  }

  render() {
    const size = this.props.hull.get("size");
    const rotation = (this.props.position.get("r") * 360) % 360; // degrees
    const component = this.props.hull.get("components").get(0);
    const style = {
      left: `${this.props.position.get("x") * 100}%`,
      top: `${this.props.position.get("y") * 100}%`,
      width: `${size}rem`,
      height: `${size}rem`,
      marginTop: `${-size / 2}rem`,
      marginLeft: `${-size / 2}rem`,
      transform: `rotate(${rotation}deg)`,
    };
    const onClick = this._onClick.bind(this);
    return (
      <span className="ship"
        style={style}
        onClick={onClick}
      >
        <Component component={component} />
      </span>
    );
  }
}

SpaceObject.propTypes = {
  position: React.PropTypes.object.isRequired,
  hull: React.PropTypes.object.isRequired,
};

export default SpaceObject;
