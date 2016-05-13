import React from "react";

class Hull extends React.Component {
  render() {
    const part = this.props.hull.get("components").get(0);
    const size = part.get("size");
    const symbol = part.get("symbol");
    const position = part.get("position");
    const rotation = (position.get("r") * 360) % 360; // degrees
    const style = {
      left: `${position.get("x") * 100}%`,
      top: `${position.get("y") * 100}%`,
      width: `${size}rem`,
      height: `${size}rem`,
      lineHeight: `${size}rem`,
      fontSize: `${size}rem`,
      marginTop: `${-size / 2}rem`,
      marginLeft: `${-size / 2}rem`,
      transform: `rotate(${rotation}deg)`,
    };
    return (
      <span className="hull"
        style={style}
      >
        {symbol}
      </span>
    );
  }
}

Hull.propTypes = {
  hull: React.PropTypes.object.isRequired,
};

export default Hull;
