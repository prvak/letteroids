import React from "react";

import Hull from "./Hull.react"

class Ship extends React.Component {
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
    const style = {
      left: `${this.props.position.get("x") * 100}%`,
      top: `${this.props.position.get("y") * 100}%`,
      width: `${size}em`,
      height: `${size}em`,
      marginTop: `${-size / 2}em`,
      marginLeft: `${-size / 2}em`,
      transform: `rotate(${rotation}deg)`,
    };
    const onClick = this._onClick.bind(this);
    return (
      <span className="ship"
        style={style}
        onClick={onClick}
      >
        <Hull hull={this.props.hull} />
      </span>
    );
  }
}

Ship.propTypes = {
  position: React.PropTypes.object.isRequired,
  hull: React.PropTypes.object.isRequired,
};

export default Ship;
