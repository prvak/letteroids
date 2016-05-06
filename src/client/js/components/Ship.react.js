import React from "react";

class Ship extends React.Component {
  getInitialState() {
    return {
      selected: false,
    };
  }

  _onClick(event) {
    event.stopPropagation();
  }

  render() {
    const size = 20; // px
    const style = {
      left: `${this.props.position.x * 100}%`,
      top: `${this.props.position.y * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      marginTop: `${-size / 2}px`,
      marginLeft: `${-size / 2}px`,
    };
    return (
      <span className="ship"
        style={style}
        onClick={this._onClick}
      >
        X
      </span>
    );
  }
}

Ship.propTypes = {
  position: React.PropTypes.object({
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
  }).isRequired,
};

export default Ship;
