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
  theRock() {
    // Choose random basic asteroid symbol.
    const symbol = random.choice(ASTEROID_SYMBOLS);
    // Scale 0.8 - 1.2 of base size.
    const size = ASTEROID_SIZE * (random.double() * 0.4 + 0.8);
    const color = "808080";
    const onHit = [{ effect: "break" }];
    return { symbol, size, color, onHit };
  }

  /** Durable small asteroid. Survives multiple hits. */
  theGranite() {
    const symbol = random.choice(ASTEROID_SYMBOLS);
    // Scale 0.8 - 1.2 of base size.
    const size = ASTEROID_SIZE * (random.double() * 0.4 + 0.8);
    const health = 9;
    const colors = [
      "#808080", "#707070", "#606060", "#505050", "#404040",
      "#303030", "#202020", "#101010", "#000000",
    ];
    const color = "808080";
    const onHit = [{ effect: "damage" }, { effect: "break" }];
    return { symbol, size, health, color, colors, onHit };
  }

  /** Four base asteroids toghether. */
  theHill(base) {
    const positions = this._positionsCross();
    const parts = [];
    positions.forEach((position) => {
      const hull = base();
      parts.push({ hull, position });
    });
    const size = ASTEROID_SIZE * 2;
    const onHit = [{ effect: "break" }];
    return { parts, size, onHit };
  }

  /** Four Hills toghether. */
  theMountain(base) {
    const positions = this._positionsCross();
    const parts = [];
    positions.forEach((position) => {
      const hull = this.theHill(base);
      parts.push({ hull, position });
    });
    const size = ASTEROID_SIZE * 4;
    const onHit = [{ effect: "break" }];
    return { parts, size, onHit };
  }

  /** Lot of tiny rocks in circle formation. */
  theCircle(base) {
    const positions = this._positionsCircle(16, 0.8);
    const parts = [];
    positions.forEach((position) => {
      const hull = base();
      parts.push({ hull, position });
    });
    const size = ASTEROID_SIZE * 4;
    const onHit = [{ effect: "damage" }, { effect: "break" }];
    const health = parts.length; // destroyed with last rock
    return { parts, size, onHit, health };
  }

  theShip() {
    const size = SHIP_SIZE;
    const symbol = SHIP_SYMBOL;
    const color = "red";
    return { symbol, size, color };
  }

  theShot() {
    const size = SHOT_SIZE / 2;
    const symbol = SHOT_SYMBOL;
    const color = "red";
    return { symbol, size, color };
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

  /** Generate positions in circle formation. */
  _positionsCircle(n, shift) {
    const rotation = () => {
      return random.double();
    };
    const positions = [];
    for (let i = 0; i < n; i++) {
      const angle = (360 / n) * i;
      const scale = 1 - 2 * shift;
      const x = shift + scale * (Math.sin(angle) + 1) / 2;
      const y = shift + scale * (Math.cos(angle) + 1) / 2;
      const r = rotation();
      positions.push({ x, y, r });
    }
    return positions;
  }
}
export default new HullGenerator();
