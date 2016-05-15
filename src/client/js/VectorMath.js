
const VectorMath = {
  /**
   * Compute current position of an object given its initial possition,
   * initial speed, acceleration and duration.
   *
   * @param {object} position Initial position and rotation of the object {x, y, r}.
   * @param {object} speed Initial speed of an object {x, y, r}.
   * @param {object} acceleration Acceleration of the object {x, y, r}.
   * @param {number} duration How long has the object traveled.
   * @return {object} Returns position of the object after specified time.
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
   * @return {object} Returns speed of the object after specified time.
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
};

export default VectorMath;
