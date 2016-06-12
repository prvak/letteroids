export default class Random {
  constructor() {
    this.prng = Math.random;
  }

  double() {
    return this.prng();
  }

  /** Generate random integer in range [0;n-1]. */
  int(n) {
    return Math.floor(this.double() * n);
  }

  /** Return random element from given array. */
  choice(array) {
    return array[this.int(array.length)];
  }
}
