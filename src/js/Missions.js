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
  /**
   * Triggered when there are no objects and all mandatory triggers where
   * triggered.
   */
  whenFinished: () => {
    return { conditions: ["finished"] };
  },
};

const Effects = {
  asteroids: (count, hull) => {
    return { type: "asteroids", count, hull };
  },
  missionFinished: () => {
    return { type: "finished" };
  },
};

/**
 * Mission object structure:
 * {
 *   events: [
 *     {
 *       trigger: {...},
 *       effect: {...},
 *       mandatory: true/false
 *     }
 *   ]
 * }
 */
const Missions = {
  /** Few medium asteroids. */
  mission1: () => {
    const events = [
      {
        trigger: Triggers.whenTime(1000),
        effect: Effects.asteroids(2, Hulls.hill),
        mandatory: true,
      },
      {
        trigger: Triggers.whenTime(10000),
        effect: Effects.asteroids(2, Hulls.hill),
        mandatory: true,
      },
      {
        trigger: Triggers.whenFinished(),
        effect: Effects.missionFinished(),
        mandatory: true,
      },
    ];
    return { events };
  },
};

export default Missions;
