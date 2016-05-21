
const VectorMath = {
  /** Numbers that differ less than this amount are considered to be equal. */
  TOLERANCE: 0.0000000001,

  /**
   * Compute current position of an object given its initial possition,
   * initial speed, acceleration and duration.
   *
   * @param {object} position Initial position and rotation of the object {x, y, r}.
   * @param {object} speed Initial speed of an object {x, y, r}.
   * @param {object} acceleration Acceleration of the object {x, y, r}.
   * @param {number} duration How long has the object traveled.
   * @returns {object} Returns position of the object after specified time {x, y, r}.
   */
  currentPosition: (position, speed, acceleration, duration) => {
    const currentPosition = {};
    const t = duration;
    ["x", "y", "r"].forEach((dimension) => {
      const p = position[dimension];
      const v = speed[dimension];
      const a = acceleration[dimension];
      // Compute distance traveled by a constantly accelerated object.
      // s = a*(t^2)/2 + v*t
      const s = a * t * t / 2 + v * t;
      currentPosition[dimension] = p + s;
    });
    return currentPosition;
  },

  /**
   * Normalize position values to interval [0;1).
   *
   * @param {object} position Position that will be normalized {x, y, r}.
   * @returns Position with values x, y and r normalized to interval [0;1).
   */
  normalizePosition: (position) => {
    const normalizedPosition = {};
    ["x", "y", "r"].forEach((dimension) => {
      let p = position[dimension];
      p = p % 1.0;
      if (p < 0) {
        p += 1.0;
      }
      normalizedPosition[dimension] = p;
    });
    return normalizedPosition;
  },

  /**
   * Compute current speed of an object given its initial speed,
   * and acceleration.
   *
   * @param {object} speed Initial speed of an object {x, y, r}.
   * @param {object} acceleration Acceleration of the object {x, y, r}.
   * @param {number} duration How long has the object traveled.
   * @return {object} Returns speed of the object after specified time {x, y, r}.
   */
  currentSpeed: (speed, acceleration, duration) => {
    const t = duration;
    const currentSpeed = {};
    ["x", "y", "r"].forEach((dimension) => {
      const v = speed[dimension];
      const a = acceleration[dimension];
      // Compute speed of a constantly accelerated object with initial speed.
      // u = a * t + v
      const u = a * t + v;
      currentSpeed[dimension] = u;
    });
    return currentSpeed;
  },

  /**
   * Compute acceleration vector based on direction and force.
   *
   * @param {number} direction Direction in range [0;1).
   * @param {number} force Applied force.
   * @returns Acceleration vector {x, y, r}. The 'r' part is always 0.
   */
  acceleration: (direction, force) => {
    const angle = VectorMath._directionToAngle(direction);
    const acceleration = {
      x: force * Math.sin(angle),
      y: -force * Math.cos(angle),
      r: 0.0,
    };
    return acceleration;
  },

  /**
   * Apply given force in given direction to an object that moves with given
   * speed.
   *
   * @param {object} speed Current speed of the object {x, y, r}.
   * @param {number} direction Direction in which to apply the force.
   * @param {number} force How fast should the object move in the new direction.
   */
  applyForce: (speed, direction, force) => {
    const acceleration = VectorMath.acceleration(direction, force);
    const newSpeed = VectorMath.currentSpeed(speed, acceleration, 1);
    return newSpeed;
  },

  /**
   * Get direction between two points.
   *
   * @param {object} from Starting point {x, y}.
   * @param {object} to Final point {x, y}.
   * @returns Direction in range [0;1). 0 is up, 0.25 is right, 0.5 is down, 0.75 is left.
   */
  direction: (from, to) => {
    const x = from.x - to.x;
    const y = from.y - to.y;
    const distance = Math.sqrt(x * x + y * y);
    let angle = Math.acos(y / distance);
    if (x < 0) {
      angle = 2 * Math.PI - angle;
    }
    // Switch from counter clock-wise to clock-wise
    angle = -angle + 2 * Math.PI;
    return (angle / (2 * Math.PI)) % 1.0;
  },

  /**
   * Test whether given objects are coliding. This function takes into
   * consideration the fact that the right and left edges of the Space as well
   * as the top and the bottom edges are connected. So if the first object is
   * near one edge and the second object is near the opposite edge than they
   * are treated as if they were next to each other.
   *
   * @param {object} position1 Position of the first object {x, y}.
   * @param {number} size1 Diameter of the first object.
   * @param {object} position2 Position of the second object {x, y}.
   * @param {number} size2 Diameter of the second object.
   * @returns True if the distance between objects is smaller than half of their sizes.
   */
  isCollision(position1, size1, position2, size2) {
    const max = (size1 + size2) / 2;
    const test = (x1, y1, x2, y2) => {
      const dx = x1 - x2;
      const dy = y1 - y2;
      const d = Math.sqrt(dx * dx + dy * dy);
      return d < max;
    };
    return test(position1.x, position1.y, position2.x, position2.y) ||
      test(position1.x + 1, position1.y, position2.x, position2.y) ||
      test(position1.x, position1.y, position2.x + 1, position2.y) ||
      test(position1.x, position1.y + 1, position2.x, position2.y) ||
      test(position1.x, position1.y, position2.x, position2.y + 1) ||
      test(position1.x, position1.y, position2.x + 1, position2.y + 1) ||
      test(position1.x + 1, position1.y + 1, position2.x, position2.y);
  },

  /**
   * Returns true if the 'value' is within TOLERANCE range around the 'to'.
   */
  isCloseTo(value, to) {
    return value >= to - VectorMath.TOLERANCE && value <= to + VectorMath.TOLERANCE;
  },

  _directionToAngle(direction) {
    return direction * 2 * Math.PI;
  },
};

export default VectorMath;
