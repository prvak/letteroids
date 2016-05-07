import React from "react";

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
    const size = this.state.isSelected ? 30 : 20; // px
    const rotation = (this.props.position.get("r") * 360 + 180) % 360; // degrees
    const style = {
      left: `${this.props.position.get("x") * 100}%`,
      top: `${this.props.position.get("y") * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      lineHeight: `${size}px`,
      fontSize: `${size}px`,
      marginTop: `${-size / 2}px`,
      marginLeft: `${-size / 2}px`,
      transform: `rotate(${rotation}deg)`,
    };
    const onClick = this._onClick.bind(this);
    return (
      <span className="ship"
        style={style}
        onClick={onClick}
      >
        {this.props.hull}
      </span>
    );
  }
}

Ship.propTypes = {
  position: React.PropTypes.object.isRequired,
  hull: React.PropTypes.string.isRequired,
};

export default Ship;
