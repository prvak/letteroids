import React from "react";

import SpaceConstants from "../constants/SpaceConstants";

class Component extends React.Component {
  render() {
    const size = this.props.component.get("size") * SpaceConstants.SPACE_SIZE;
    const symbol = this.props.component.get("symbol");
    const subcomponents = this.props.component.get("components");
    const position = this.props.component.get("position");
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

    let data = null;
    if (subcomponents) {
      data = [];
      subcomponents.forEach((component, index) => {
        data.push(<Component key={index} component={component} />);
      });
    } else if (symbol) {
      data = symbol;
    } else {
      console.log("Something is wrong");
    }
    return <span className="component" style={style} > {data} </span>;
  }
}

Component.propTypes = {
  component: React.PropTypes.object.isRequired,
};

export default Component;
