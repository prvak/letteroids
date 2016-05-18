import Seedrandom from "seedrandom";

export default class Random {
  constructor(seed) {
    this.prng = new Seedrandom(seed);
  }

  random() {
    return this.prng();
  }

  /** Generate random integer in range [0;n-1). */
  int(n) {
    let number = this.prng.int32();
    if (number < 0) {
      number = -number;
    }
    return number % n;
  }

  /** Return random element from given array. */
  choice(array) {
    return array[this.int(array.length)];
  }
}
