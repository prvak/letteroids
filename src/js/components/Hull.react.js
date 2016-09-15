import React from "react";

import SpaceConstants from "../constants/SpaceConstants";

class Hull extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.hull !== nextProps.hull
      || this.props.position !== nextProps.position;
  }

  render() {
    const hull = this.props.hull;
    const size = hull.get("size") * SpaceConstants.SPACE_SIZE;
    const symbol = hull.get("symbol");
    const parts = hull.get("parts");
    let position = this.props.position;
    if (position) {
      position = position.toJS();
    } else {
      position = { x: 0.5, y: 0.5, r: 0.0 };
    }
    const rotation = (position.r * 360) % 360; // degrees
    const style = {
      left: `${position.x * 100}%`,
      top: `${position.y * 100}%`,
      width: `${size}rem`,
      height: `${size}rem`,
      lineHeight: `${size}rem`,
      fontSize: `${size}rem`,
      marginTop: `${-size / 2}rem`,
      marginLeft: `${-size / 2}rem`,
      transform: `rotate(${rotation}deg)`,
    };

    if (parts) {
      const hulls = [];
      parts.forEach((part, index) => {
        hulls.push(<Hull
          key={index}
          hull={part.get("hull")}
          position={part.get("position")}
        />);
      });
      return <span className="hull" style={style}>{hulls}</span>;
    } else if (symbol) {
      const colors = this.props.hull.get("colors");
      let color = this.props.hull.get("color");
      if (colors) {
        // color is based on current health
        const health = this.props.hull.get("health");
        if (health <= 0) {
          color = colors.get(0);
        } else {
          color = colors.get(health - 1);
        }
      }
      style.color = color;
      return <span className="hull" style={style} >{symbol}</span>;
    }
    throw new Error("Component does not have neither 'symbol' nor 'parts'!");
  }
}

Hull.propTypes = {
  hull: React.PropTypes.object.isRequired,
  position: React.PropTypes.object,
};

export default Hull;
