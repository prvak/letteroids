const SpaceConstants = {
  // Space is a square. This is the length of its side in rem units.
  SPACE_SIZE: 50,
  // Ship rotation speed in full rotations per second.
  SHIP_ROTATION_SPEED: 0.5,
  // Acceleration in screens per second^2.
  SHIP_ACCELERATION: 0.25,
  // Number of shots fired per second.
  SHIP_SHOOTING_SPEED: 7,
  // How many frames per second to draw.
  FPS: 25,
  // How many milliseconds does the shot live. Shots disappear after this period.
  SHOT_TTL: 3000,
  // Speed of a shot in screens per second. Speed is relative to ship's speed.
  SHOT_SPEED: 0.3,
  // Speed of a new asteroid of scale 1. The bigger the asteroid the lower the speed.
  ASTEROID_SPEED: 0.3,
  // Maximum rotation speed of a new asteroid. It is randomized.
  ASTEROID_ROTATION_SPEED: 0.1,
  // Maximum deviation from the direct horizontal of vertical direction of a new asteroid.
  ASTEROID_DIRECTION: 0.05,
  // After a ship or asteroid is destroyed few temporary junk objects are created.
  // This is how many milliseconds it takes before they expire.
  JUNK_TTL: 500,
  // How fast does the junk fly (in screes per second).
  JUNK_FORCE: 0.05,
  // Direction in which does the junk fly in relation to original direction of the destroyed object.
  JUNK_ANGLE: 0.125,
  // Force applied to a broken asteroid.
  SPLIT_FORCE: 0.05,
  // How many points are awarded for each shot fired.
  SCORE_SHOT: -1,
  // How many points are awarded for each hit of asteroid of scale 1. The bigger the asteroid
  // the smaller the reward.
  SCORE_HIT: 10,
  // How many times per second should we try to create a new asteroid.
  ASTEROID_FREQUENCY: 5,
  // Base probability that a new asteroid will be created for each millisecond since last asteroid.
  // Increase this value for higher difficulty.
  ASTEROID_PROBABILITY: 0.000004,
};

export default SpaceConstants;
