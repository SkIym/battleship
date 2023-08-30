export default class Ship {
  constructor(length) {
    this.length = length;
    this.sunk = false;
    this.hits = 0;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    if(this.length === this.hits) this.sunk = true;
    return this.sunk;
  }

}