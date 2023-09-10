export default class Gameboard {
  constructor() {
    this.board = [];
    this.missed = [];
    this.shipParts = 0;
    this.init();
  }

  init() {
    for (let i = 0; i < 10; i += 1) {
      this.board[i] = [];
      for (let j = 0; j < 10; j += 1) {
        this.board[i].push(null);
      }
    }
  }

  reset() {
    this.board = [];
    this.missed = [];
    this.shipParts = 0;
    this.init();
  }

  placeShip(coord, ship, hori = true) {
    const { length } = ship;
    const [x, y] = coord;

    // Filter through invalid placements
    if (
      hori &&
      (y + length - 1 > 9 || this.isInvalidHoriPlacement(x, y, length))
    )
      return false;
    if (
      !hori &&
      (x + length - 1 > 9 || this.isInvalidVertiPlacement(x, y, length))
    )
      return false;

    for (let i = 0; i < length; i += 1) {
      if (hori) {
        this.board[x][y + i] = ship;
      } else {
        this.board[x + i][y] = ship;
      }
      this.shipParts += 1;
    }
    return true;
  }

  isInvalidHoriPlacement(x, y, length) {
    for (let i = x - 1; i <= x + 1; i += 1) {
      for (let j = y - 1; j <= y + length; j += 1) {
        if (i >= 0 && i <= 9 && j >= 0 && j <= 9 && this.board[i][j])
          return true;
      }
    }
    return false;
  }

  isInvalidVertiPlacement(x, y, length) {
    for (let i = x - 1; i <= x + length; i += 1) {
      for (let j = y - 1; j <= y + 1; j += 1) {
        if (i >= 0 && i <= 9 && j >= 0 && j <= 9 && this.board[i][j])
          return true;
      }
    }
    return false;
  }

  receiveAttack(coord) {
    const [x, y] = coord;
    const ship = this.board[x][y];
    if (ship) {
      ship.hit();
      this.shipParts -= 1;
      return ship;
    }
    this.missed.push(coord);
    return false;
  }

  shipsHaveSunk() {
    if (this.shipParts === 0) return true;
  }
}
