import React from "react";
import objectsStore from "../stores/ObjectsStore";
import SpaceActions from "../actions/SpaceActions";
import Ship from "../components/Ship.react";

class Space extends React.Component {
  constructor() {
    super();
    this.state = {
      ships: objectsStore.getShips(),
    };
  }

  componentDidMount() {
    objectsStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    objectsStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    return {
      ships: objectsStore.getShips(),
    };
  }

  _onClick(event) {
    const position = this._relativeMousePosition(event);
    console.log("New Ship", position.x, position.y);
    SpaceActions.addObject(position);
  }

  _relativeMousePosition(event) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let canvasX = 0;
    let canvasY = 0;
    let currentElement = event.currentTarget;
    console.log(currentElement);

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
      currentElement = currentElement.offsetParent;
    } while (currentElement);

    canvasX = (event.pageX - totalOffsetX) / event.currentTarget.clientWidth;
    canvasY = (event.pageY - totalOffsetY) / event.currentTarget.clientHeight;

    return { x: canvasX, y: canvasY };
  }

  render() {
    const ships = this.props.ships.map((ship) => {
      return <Ship position={ship.position} key={ship.id} />;
    });
    console.log("Render Space:", ships);
    const onClick = this._onClick.bind(this);
    return (
      <div
        className="space"
        onClick={onClick}
      >
        {ships}
      </div>
    );
  }
}

Space.propTypes = {
  ships: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default Space;
