
export default class Gameboard {

  constructor() {
    this.board = [];
    this.missed = [];
    this.shipParts = 0;
    this.init()
  }
  
  init() {
    for (let i=0; i < 10; i+=1) {
      this.board[i] = []
      for (let j=0; j < 10; j+=1) {
        this.board[i].push(null)
      }
    }
  }

  placeShip(coord, ship) {
    const {length} = ship;
    const [x, y] = coord;

    if (y + length - 1 > 9) return;

    for(let i = 0; i < length; i += 1) {
      this.board[x][y+i] = ship;
      this.shipParts += 1;
    }
  }

  receiveAttack(coord) {
    const [x, y] = coord;
    const ship = this.board[x][y]
    if(ship) {
      ship.hit()
      this.shipParts -= 1;
      return true
    }
    this.missed.push(coord)
    return false
  }

  shipsHaveSunk() {
    if (this.shipParts === 0) return true;
  }

}
