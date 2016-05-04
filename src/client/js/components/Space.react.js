import React from "react";
import objectsStore from "../stores/ObjectsStore";
import SpaceActions from "../actions/SpaceActions";
import Ship from "../components/Ship.react";

const Space = React.createClass({
  getInitialState: function() {
    return {
      ships: objectsStore.getShips(),
    };
  },

  componentDidMount: function() {
    objectsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    objectsStore.removeChangeListener(this._onChange);
  },

  render: function() {
    const ships = this.props.ships.map((ship) => {
      return <Ship position={ship.position} key={ship.id} />;
    });
    console.log("Render Space:", ships);
    return (
      <div className="space" onClick={this._onClick}>
        {ships}
      </div>
    );
  },

  _onChange: function() {
    return {
      ships: objectsStore.getShips(),
    };
  },

  _onClick: function(event) {
    const position = this._relativeMousePosition(event);
    console.log("New Ship", position.x, position.y);
    SpaceActions.addObject(position);
  },

  _relativeMousePosition: function(event) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let canvasX = 0;
    let canvasY = 0;
    let currentElement = event.currentTarget;
    console.log(currentElement);

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = (event.pageX - totalOffsetX) / event.currentTarget.clientWidth;
    canvasY = (event.pageY - totalOffsetY) / event.currentTarget.clientHeight;

    return {x:canvasX, y:canvasY}
  },

});

export default Space;
