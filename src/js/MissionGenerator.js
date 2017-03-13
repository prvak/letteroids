import Hulls from "./Hulls";

/**
 * Each trigger has a list of conditions. All conditions must satisfied for the
 * trigger to be active.
 */
const Triggers = {
  /**
   * Triggered when mission time is greater than given value.
   */
  whenTime: (time) => {
    return { conditions: ["time"], time };
  },
};

const Effects = {
  asteroids: (count, hull) => {
    return { type: "asteroids", count, hull };
  },
};

/**
 * Mission object structure:
 * {
 *   events: [
 *     {
 *       trigger: {...},
 *       effect: {...},
 *     }
 *   ]
 * }
 */
const MissionGenerator = {
  /** Few medium asteroids. */
  mission1: () => {
    const events = [
      {
        trigger: Triggers.whenTime(0),
        effect: Effects.asteroids(1, Hulls.hill),
      },
      // {
      //   trigger: Triggers.whenTime(10000),
      //   effect: Effects.asteroids(2, Hulls.hill),
      // },
    ];
    return { events };
  },
};

export default MissionGenerator;
