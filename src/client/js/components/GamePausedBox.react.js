import React from "react";

class GamePausedBox extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const title = "Paused";
    const message = "Press any key to continue.";
    return (<div className="messageBox">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>);
  }
}

export default GamePausedBox;
