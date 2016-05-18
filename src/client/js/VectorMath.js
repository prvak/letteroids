
const VectorMath = {
  /**
   * Compute current position of an object given its initial possition,
   * initial speed, acceleration and duration.
   *
   * @param {object} position Initial position and rotation of the object {x, y, r}.
   * @param {object} speed Initial speed of an object {x, y, r}.
   * @param {object} acceleration Acceleration of the object {x, y, r}.
   * @param {number} duration How long has the object traveled.
   * @return {object} Returns position of the object after specified time {x, y, r}.
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
      // Normalize to interval [0:1).
      let newP = (p + s) % 1.0;
      if (newP < 0) {
        newP += 1.0;
      }
      currentPosition[dimension] = newP;
    });
    return currentPosition;
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
   * Apply given force in given direction to an object that moves with given
   * speed.
   *
   * @param {object} speed Current speed of the object {x, y, r}.
   * @param {number} direction Direction in which to apply the force.
   * @param {number} force How fast should the object move in the new direction.
   */
  applyForce: (speed, direction, force) => {
    const angle = direction * 2 * Math.PI;
    const newSpeed = {
      x: force * Math.sin(angle) + speed.x,
      y: -force * Math.cos(angle) + speed.y,
      r: speed.r,
    };
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
    const x = to.x - from.x;
    const y = to.y - from.y;
    let angle = Math.acos(x / Math.sqrt(x * x + y * y));
    if (y < 0) {
      angle = 2 * Math.PI - angle;
    }
    const direction = (-(angle / (2 * Math.PI)) + 1.25) % 1.0;
    return direction;
  },
};

export default VectorMath;