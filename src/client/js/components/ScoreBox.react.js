import React from "react";

class ScoreBox extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.score !== nextProps.score;
  }

  render() {
    const score = this.props.score;
    return <div className="scoreBox">{score}</div>;
  }
}

ScoreBox.propTypes = {
  score: React.PropTypes.number.isRequired,
};

export default ScoreBox;
