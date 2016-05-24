import React from "react";

class MessageBox extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div className="messageBox"><h1>{this.props.title}</h1></div>;
  }
}

MessageBox.propTypes = {
  title: React.PropTypes.string.isRequired,
};

export default MessageBox;
