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
    const style = {
      left: `${this.props.position.x * 100}%`,
      top: `${this.props.position.y * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      marginTop: `${-size / 2}px`,
      marginLeft: `${-size / 2}px`,
    };
    const onClick = this._onClick.bind(this);
    return (
      <span className="ship"
        style={style}
        onClick={onClick}
      >
        X
      </span>
    );
  }
}

Ship.propTypes = {
  position: React.PropTypes.object.isRequired,
};

export default Ship;
