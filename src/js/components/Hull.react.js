import React from "react";

import SpaceConstants from "../constants/SpaceConstants";

class Hull extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.hull !== nextProps.hull
      || this.props.position !== nextProps.position;
  }

  render() {
    const size = this.props.hull.get("size") * SpaceConstants.SPACE_SIZE;
    const symbol = this.props.hull.get("symbol");
    const parts = this.props.hull.get("parts");
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
      const theme = this.props.hull.get("theme");
      const classNames = `hull ${theme}`;
      return <span className={classNames} style={style} >{symbol}</span>;
    }
    throw new Error("Component does not have neither 'symbol' nor 'parts'!");
  }
}

Hull.propTypes = {
  hull: React.PropTypes.object.isRequired,
  position: React.PropTypes.object,
};

export default Hull;
