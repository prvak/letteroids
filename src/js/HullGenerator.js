import Random from "./Random";

const random = new Random();

// Symbols used as asteroids.
const ASTEROID_SYMBOLS = ["@", "#", "$"];
// Symbol representing a ship.
const SHIP_SYMBOL = "Δ";
// Symbol representing a shot.
const SHOT_SYMBOL = "*";
// Basic size. All sizes are relative to this one.
const SIZE_UNIT = 0.01;
const SHOT_SIZE = SIZE_UNIT;
const ASTEROID_SIZE = 4 * SIZE_UNIT;
const SHIP_SIZE = 2 * SIZE_UNIT;

class HullGenerator {
  /** The most simple rock, size 1, breaks with one hit. */
  theTinyRock() {
    // Choose random basic asteroid symbol.
    const symbol = random.choice(ASTEROID_SYMBOLS);
    // Scale 0.8 - 1.2 of base size.
    const size = ASTEROID_SIZE * (random.double() * 0.4 + 0.8);
    const theme = "basic";
    const onHit = [{ effect: "break" }];
    return { symbol, size, theme, onHit };
  }

  /** Four tiny rocks toghether. */
  theRocky() {
    const positions = this._positionsCross();
    const parts = [];
    positions.forEach((position) => {
      const hull = this.theTinyRock();
      parts.push({ hull, position });
    });
    const size = ASTEROID_SIZE * 2;
    const onHit = [{ effect: "break" }];
    return { parts, size, onHit };
  }

  theShip() {
    const size = SHIP_SIZE;
    const symbol = SHIP_SYMBOL;
    const theme = "player";
    return { symbol, size, theme };
  }

  theShot() {
    const size = SHOT_SIZE / 2;
    const symbol = SHOT_SYMBOL;
    const theme = "player";
    return { symbol, size, theme };
  }

  /** Generate four positions. */
  _positionsCross() {
    const rotation = () => {
      return random.double();
    };
    return [
      { x: 0.25, y: 0.5, r: rotation() },
      { x: 0.75, y: 0.5, r: rotation() },
      { x: 0.5, y: 0.75, r: rotation() },
      { x: 0.5, y: 0.25, r: rotation() },
    ];
  }
}
export default new HullGenerator();
