import React from "react";

import Component from "./Component.react";

class Components extends React.Component {
  render() {
    const components = [];
    this.props.components.forEach((component, index) => {
      components.push(<Component key={index} component={component} />);
    });
    return <span> {components} </span>;
  }
}

Components.propTypes = {
  components: React.PropTypes.object.isRequired,
};

export default Components;
