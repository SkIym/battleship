
export default class Player {
  constructor(name, enemyBoard, playerBoard) {
    this.name = name;
    this.enemyBoard = enemyBoard;
    this.playerBoard = playerBoard;
    this.moves = [];
  }

  setBoard(pieces) {
    pieces.forEach(piece => {
      const [coord, ship] = piece;
      this.playerBoard.placeShip(coord, ship);
    });
  }

  attackEnemy(coord) {
    this.enemyBoard.receiveAttack(coord)
  }

  chooseAttack() {
    coord = 
    const coord = [parseInt(Math.random() * 10, 10), parseInt(Math.random() * 10, 10)]
    const done = this.moves.find((move) => {
      if (move[0] === coord[0] && move[1] === coord[1]) return move
      return undefined
    })
    if(!done) this.attackEnemy(coord);

  }

  // continueAttack() {
  //   // If previous turnwas successful
  // }
}