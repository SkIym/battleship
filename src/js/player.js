
export default class Player {
  constructor(name, enemyBoard, playerBoard, moves = []) {
    this.name = name;
    this.enemyBoard = enemyBoard;
    this.playerBoard = playerBoard;
    this.moves = moves;
    this.targetShip = null;
    this.targetTile = null;
    this.targetStack = [];
    this.lastHitTile = null;
  }

  reset() {
    this.moves = [];
    this.targetShip = null;
    this.targetTile = null;
  }

  setBoard(pieces) {
    pieces.forEach(piece => {
      const [coord, ship] = piece;
      this.playerBoard.placeShip(coord, ship);
    });
  }

  attackEnemy(coord) {
    this.targetTile = coord;
    this.moves.push(coord)
    return this.enemyBoard.receiveAttack(coord)
  }

  chooseAttack() {
    const coord = [parseInt(Math.random() * 10, 10), parseInt(Math.random() * 10, 10)]
    const done = this.moves.find((move) => move[0] === coord[0] && move[1] === coord[1]);
    if(!done) {
      return this.attackEnemy(coord);
    } 
    return this.chooseAttack();
  }

  continueAttack(prevTile) {
    const [x, y] = prevTile;
    console.log('previous hit tile', prevTile);

    
    this.targetStack.unshift(...Player.shuffleArray([
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ]));

    let coord = this.targetStack.shift()
    while(!(coord[0] >= 0  && coord[0]  <= 9 && coord[1] >= 0&& coord[1]  <= 9) ||
    (this.moves.find((move) => move[0] === coord[0] && move[1] === coord[1]))) {
      coord = this.targetStack.shift();
    }
    console.log('current stack', this.targetStack)
    console.log('picked tile', coord)
    
    
    return this.attackEnemy(coord);


  }

  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i-= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array
  }
}