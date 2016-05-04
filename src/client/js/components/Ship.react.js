import React from "react";

const Ship = React.createClass({
  getInitialState: function() {
    return {
      selected: false,
    };
  },

  render: function() {
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
        onClick={this._onClick}>
        X
      </span>
    );
  },

  _onClick: function(event) {
    event.stopPropagation();
  }
});

export default Ship;
