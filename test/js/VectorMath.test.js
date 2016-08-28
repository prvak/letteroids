import chai from "chai";
import deepEqual from "chai-shallow-deep-equal";

chai.should();
chai.use(deepEqual);

import VectorMath from "../../src/js/VectorMath";

const TOLERANCE = 0.0000000001;

/** Check that all values in given object are equal or almost equal to expected object. */
function equalsDeepWithin(expected, actual, tolerance = TOLERANCE) {
  Object.keys(expected).forEach((key) => {
    const expectedValue = expected[key];
    const actualValue = actual[key];
    actualValue.should.be.within(expectedValue - tolerance, expectedValue + tolerance,
      `At path "/${key}"`);
  });
}

function equalsWithin(expected, actual, tolerance = TOLERANCE) {
  actual.should.be.within(expected - tolerance, expected + tolerance);
}

describe("VectorMath", () => {
  describe("currentPosition", () => {
    it("still object's position should not change", () => {
      const position = { x: 0.0, y: 0.0, r: 0.0 };
      const speed = { x: 0.0, y: 0.0, r: 0.0 };
      const acceleration = { x: 0.0, y: 0.0, r: 0.0 };
      const duration = 10;
      const p = VectorMath.currentPosition(position, speed, acceleration, duration);
      equalsDeepWithin(p, { x: 0.0, y: 0.0, r: 0.0 });
    });
    it("non-accelerated object should move linearily", () => {
      const position = { x: 0.0, y: 0.0, r: 0.0 };
      const speed = { x: 0.1, y: 0.1, r: 0.0 };
      const acceleration = { x: 0.0, y: 0.0, r: 0.0 };
      const duration = 5;
      const p = VectorMath.currentPosition(position, speed, acceleration, duration);
      equalsDeepWithin(p, { x: 0.5, y: 0.5, r: 0.0 });
    });
    it("accelerated object should move with acceleration", () => {
      const position = { x: 0.1, y: 0.1, r: 0.0 };
      const speed = { x: 0.2, y: 0.2, r: 0.0 };
      const acceleration = { x: -0.2, y: -0.2, r: 0.0 };
      const duration = 1;
      const p = VectorMath.currentPosition(position, speed, acceleration, duration);
      equalsDeepWithin(p, { x: 0.2, y: 0.2, r: 0.0 });
    });
    it("coordinates do not have to be in range [0,1)", () => {
      const position = { x: 0.0, y: 0.0, r: 0.0 };
      const speed = { x: 0.1, y: 0.5, r: 0.2 };
      const acceleration = { x: 0.0, y: 0.0, r: 0.0 };
      const duration = 5;
      const p = VectorMath.currentPosition(position, speed, acceleration, duration);
      equalsDeepWithin(p, { x: 0.1 * 5, y: 2.5, r: 1.0 });
    });
  });
  describe("normalizePosition", () => {
    it("normalize values that are '< 0.0' or '>= 1.0' to range [0;1)", () => {
      const position = { x: -0.5, y: 1.0, r: 1.3 };
      const p = VectorMath.normalizePosition(position);
      equalsDeepWithin(p, { x: 0.5, y: 0.0, r: 0.3 });
    });
  });
  describe("absolutePosition", () => {
    it("works for non-rotated objects", () => {
      const position = { x: 0.5, y: 0.5, r: 0.0 };
      const subPosition = { x: 0.0, y: 0.0, r: 0.0 };
      const size = 0.2;
      const p = VectorMath.absolutePosition(position, subPosition, size);
      equalsDeepWithin(p, { x: 0.4, y: 0.4, r: 0.0 });
    });
    it("works for rotated objects", () => {
      const position = { x: 0.5, y: 0.5, r: 0.25 };
      const subPosition = { x: 0.0, y: 0.0, r: 0.1 };
      const size = 0.4;
      const p = VectorMath.absolutePosition(position, subPosition, size);
      equalsDeepWithin(p, { x: 0.7, y: 0.3, r: 0.35 });
    });
    it("no change for global object", () => {
      const position = { x: 0.5, y: 0.5, r: 0.0 };
      const subPosition = { x: 0.3, y: 0.7, r: 0.2 };
      const size = 1.0;
      const p = VectorMath.absolutePosition(position, subPosition, size);
      equalsDeepWithin(p, { x: 0.3, y: 0.7, r: 0.2 });
    });
  });
  describe("currentSpeed", () => {
    it("non-accelerated object's speed should not change", () => {
      const speed = { x: 0.5, y: 0.4, r: 0.3 };
      const acceleration = { x: 0.0, y: 0.0, r: 0.0 };
      const duration = 10;
      const s = VectorMath.currentSpeed(speed, acceleration, duration);
      equalsDeepWithin(s, { x: 0.5, y: 0.4, r: 0.3 });
    });
    it("accelerated object's speed should change accordingly", () => {
      const speed = { x: 0.5, y: 0.4, r: 0.2 };
      const acceleration = { x: 0.1, y: 0.1, r: 0.1 };
      const duration = 6;
      const s = VectorMath.currentSpeed(speed, acceleration, duration);
      equalsDeepWithin(s, { x: 1.1, y: 1.0, r: 0.8 });
    });
  });
  describe("acceleration", () => {
    it("rotation 45 deg to the left", () => {
      const direction = 0.875;
      const force = 0.2;
      const a = VectorMath.acceleration(direction, force);
      equalsDeepWithin(a, { x: -force * Math.sqrt(2) / 2, y: -force * Math.sqrt(2) / 2, r: 0.0 });
    });
    it("rotation down", () => {
      const direction = 0.5;
      const force = 0.2;
      const a = VectorMath.acceleration(direction, force);
      equalsDeepWithin(a, { x: 0.0, y: force, r: 0.0 });
    });
    it("rotation right", () => {
      const direction = 0.25;
      const force = 0.2;
      const a = VectorMath.acceleration(direction, force);
      equalsDeepWithin(a, { x: force, y: 0.0, r: 0.0 });
    });
    it("rotation left", () => {
      const direction = 0.75;
      const force = 0.2;
      const a = VectorMath.acceleration(direction, force);
      equalsDeepWithin(a, { x: -force, y: 0.0, r: 0.0 });
    });
    it("rotation up", () => {
      const direction = 0.0;
      const force = 0.2;
      const a = VectorMath.acceleration(direction, force);
      equalsDeepWithin(a, { x: 0.0, y: -force, r: 0.0 });
    });
  });
  describe("applyForce", () => {
    it("object should move up for direction 0.0", () => {
      const speed = { x: 0.4, y: 0.4, r: 0.2 };
      const direction = 0.0;
      const force = 0.2;
      const s = VectorMath.applyForce(speed, direction, force);
      equalsDeepWithin(s, { x: 0.4, y: 0.2, r: 0.2 });
    });
    it("object should move to the left for direction 0.75", () => {
      const speed = { x: 0.4, y: 0.4, r: 0.2 };
      const direction = 0.75;
      const force = 0.2;
      const s = VectorMath.applyForce(speed, direction, force);
      equalsDeepWithin(s, { x: 0.2, y: 0.4, r: 0.2 });
    });
    it("object can stop", () => {
      const speed = { x: -0.1, y: 0.1, r: 0.5 };
      const direction = 0.125;
      const force = Math.sqrt(2) * 0.1;
      const s = VectorMath.applyForce(speed, direction, force);
      equalsDeepWithin(s, { x: 0.0, y: 0.0, r: 0.5 });
    });
  });
  describe("direction", () => {
    it("up should equal 0.0", () => {
      const from = { x: 0.0, y: 0.5 };
      const to = { x: 0.0, y: 0.1 };
      const d = VectorMath.direction(from, to);
      equalsWithin(d, 0.0);
    });
    it("right should equal 0.25", () => {
      const from = { x: 0.5, y: 0.5 };
      const to = { x: 0.6, y: 0.5 };
      const d = VectorMath.direction(from, to);
      equalsWithin(d, 0.25);
    });
    it("down should equal 0.5", () => {
      const from = { x: 0.5, y: 0.5 };
      const to = { x: 0.5, y: 0.6 };
      const d = VectorMath.direction(from, to);
      equalsWithin(d, 0.5);
    });
    it("left should equal 0.75", () => {
      const from = { x: 0.5, y: 0.5 };
      const to = { x: 0.1, y: 0.5 };
      const d = VectorMath.direction(from, to);
      equalsWithin(d, 0.75);
    });
    it("down and right should equal 0.375", () => {
      const from = { x: 0.5, y: 0.5 };
      const to = { x: 0.6, y: 0.6 };
      const d = VectorMath.direction(from, to);
      equalsWithin(d, 0.375);
    });
    it("same points in oposite order should give oposite direction", () => {
      const from = { x: 0.4, y: 0.5 };
      const to = { x: 0.1, y: 0.3 };
      const d1 = VectorMath.direction(from, to);
      const d2 = VectorMath.direction(to, from);
      equalsWithin(d1, (d2 + 0.5) % 1.0);
    });
    it("direction from a point to itself should return NaN", () => {
      const from = { x: 0.4, y: 0.4 };
      const to = { x: 0.4, y: 0.4 };
      const d = VectorMath.direction(from, to);
      d.should.be.NaN;
    });
  });
  describe("speedDirection", () => {
    it("speed to bottom rigth should return direction 135 degrees", () => {
      const speed = { x: 0.5, y: 0.5 };
      const d = VectorMath.speedDirection(speed);
      equalsWithin(d, 0.375);
    });
    it("speed to left should return direction 270 degrees", () => {
      const speed = { x: -0.5, y: 0.0 };
      const d = VectorMath.speedDirection(speed);
      equalsWithin(d, 0.75);
    });
  });
  describe("isCollision", () => {
    it("should return true for objects that are close", () => {
      const position1 = { x: 0.4, y: 0.5 };
      const position2 = { x: 0.6, y: 0.5 };
      const size1 = 0.2;
      const size2 = 0.4;
      VectorMath.isCollision(position1, size1, position2, size2).should.be.true;
      VectorMath.isCollision(position2, size2, position1, size1).should.be.true;
    });
    it("should return false for objects that far away", () => {
      const position1 = { x: 0.5, y: 0.3 };
      const position2 = { x: 0.5, y: 0.7 };
      const size1 = 0.2;
      const size2 = 0.4;
      VectorMath.isCollision(position1, size1, position2, size2).should.be.false;
      VectorMath.isCollision(position2, size2, position1, size1).should.be.false;
    });
    it("should return true for objects close to the x edge", () => {
      const position1 = { x: 0.1, y: 0.5 };
      const position2 = { x: 0.9, y: 0.5 };
      const size1 = 0.2;
      const size2 = 0.3;
      VectorMath.isCollision(position1, size1, position2, size2).should.be.true;
      VectorMath.isCollision(position2, size2, position1, size1).should.be.true;
    });
    it("should return true for objects close to the y edge", () => {
      const position1 = { x: 0.5, y: 0.1 };
      const position2 = { x: 0.5, y: 0.9 };
      const size1 = 0.25;
      const size2 = 0.25;
      VectorMath.isCollision(position1, size1, position2, size2).should.be.true;
      VectorMath.isCollision(position2, size2, position1, size1).should.be.true;
    });
    it("should return true for objects close to the x and y edge", () => {
      const position1 = { x: 0.1, y: 0.1 };
      const position2 = { x: 0.9, y: 0.9 };
      const size1 = 0.2;
      const size2 = 0.4;
      VectorMath.isCollision(position1, size1, position2, size2).should.be.true;
      VectorMath.isCollision(position2, size2, position1, size1).should.be.true;
    });
    it("should return false for objects close different edges", () => {
      const position1 = { x: 0.1, y: 0.9 };
      const position2 = { x: 0.9, y: 0.1 };
      const size1 = 0.2;
      const size2 = 0.4;
      VectorMath.isCollision(position1, size1, position2, size2).should.be.false;
      VectorMath.isCollision(position2, size2, position1, size1).should.be.false;
    });
    it("should return false for new objects outside the edge", () => {
      const position1 = { x: 0.1, y: 0.1 };
      const position2 = { x: 0.1, y: 1.1 };
      const size1 = 0.1;
      const size2 = 0.1;
      VectorMath.isCollision(position1, size1, position2, size2).should.be.false;
      VectorMath.isCollision(position2, size2, position1, size1).should.be.false;
    });
    it("should return true for new objects partialy outside the edge", () => {
      const position1 = { x: 0.1, y: 0.9 };
      const position2 = { x: 0.1, y: 1.1 };
      const size1 = 0.2;
      const size2 = 0.3;
      VectorMath.isCollision(position1, size1, position2, size2).should.be.true;
      VectorMath.isCollision(position2, size2, position1, size1).should.be.true;
    });
  });
  describe("isCloseTo", () => {
    it("should return true for number a bit smaller", () => {
      VectorMath.isCloseTo(1.1, 1.0999999999999999).should.be.true;
    });
    it("should return true for number a bit larger", () => {
      const result = VectorMath.isCloseTo(1.1, 1.1000000000001);
      result.should.be.true;
    });
    it("should return false for number that is more than 'TOLERANCE' smaller", () => {
      const result = VectorMath.isCloseTo(1.1, 1.1 - VectorMath.TOLERANCE - 0.000000000001);
      result.should.be.false;
    });
    it("should return false for number that is more than 'TOLERANCE' larger", () => {
      const result = VectorMath.isCloseTo(1.1, 1.1 + VectorMath.TOLERANCE + 0.000000000001);
      result.should.be.false;
    });
  });
});
