import React from "react";

class GameOverBox extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const title = "Game Over";
    const message = "Press any key to continue.";
    return (<div className="messageBox">
      <h1>{title}</h1>
      <p><span>Score:</span></p><p><span className="score">{this.props.score}</span></p>
      <p><span>Hi Score:</span></p><p><span className="score">{this.props.hiScore}</span></p>
      <p>{message}</p>
    </div>);
  }
}

GameOverBox.propTypes = {
  score: React.PropTypes.number.isRequired,
  hiScore: React.PropTypes.number.isRequired,
};

export default GameOverBox;
