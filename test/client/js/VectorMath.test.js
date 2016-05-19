import chai from "chai";
import deepEqual from "chai-shallow-deep-equal";

chai.should();
chai.use(deepEqual);

import VectorMath from "../../../src/client/js/VectorMath";

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
  describe("isPositionNormalized", () => {
    it("returns false for range [0;1)", () => {
      const position = { x: 0.0, y: 0.5, r: 0.99999999 };
      const isNormalized = VectorMath.isPositionNormalized(position);
      isNormalized.should.be.true;
    });
    it("returns false for 1.0", () => {
      const position = { x: 0.5, y: 0.5, r: 1.0 };
      const isNormalized = VectorMath.isPositionNormalized(position);
      isNormalized.should.be.false;
    });
    it("returns false for negative values", () => {
      const position = { x: 0.5, y: -0.5, r: 0.5 };
      const isNormalized = VectorMath.isPositionNormalized(position);
      isNormalized.should.be.false;
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
      const from = { x: 0.0, y: 0.0 };
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
      const to = { x: 0.5, y: 0.1 };
      const d = VectorMath.direction(from, to);
      equalsWithin(d, 0.5);
    });
    it("left should equal 0.75", () => {
      const from = { x: 0.5, y: 0.5 };
      const to = { x: 0.1, y: 0.5 };
      const d = VectorMath.direction(from, to);
      equalsWithin(d, 0.75);
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
