const SpaceConstants = {
  // Space is a square. This is the length of its side in rem units.
  SPACE_SIZE: 50,
  // Ship rotation speed in full rotations per second.
  SHIP_ROTATION_SPEED: 0.6,
  // Acceleration in screens per second^2.
  SHIP_ACCELERATION: 0.3,
  // Number of shots fired per second.
  SHIP_SHOOTING_SPEED: 10,
  // How many frames per second to draw.
  FPS: 30,
  // How many milliseconds does the shot live. Shots disappear after this period.
  SHOT_TTL: 3000,
  // Speed of a shot in screens per second. Speed is relative to ship's speed.
  SHOT_SPEED: 0.3,
};

export default SpaceConstants;
