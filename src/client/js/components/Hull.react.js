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
      width: `${size}em`,
      height: `${size}em`,
      lineHeight: `${size}em`,
      fontSize: `${size}em`,
      marginTop: `${-size / 2}em`,
      marginLeft: `${-size / 2}em`,
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
