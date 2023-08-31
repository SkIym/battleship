
export default class Player {
  constructor(name, enemyBoard, playerBoard, moves = []) {
    this.name = name;
    this.enemyBoard = enemyBoard;
    this.playerBoard = playerBoard;
    this.moves = moves;
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
    return this.enemyBoard.receiveAttack(coord)
  }

  chooseAttack() {
    const coord = [parseInt(Math.random() * 10, 10), parseInt(Math.random() * 10, 10)]
    const done = this.moves.find((move) => move[0] === coord[0] && move[1] === coord[1]);
    if(!done) {
      this.targetTile = coord;
      this.moves.push(coord)
      return this.attackEnemy(coord);
    } 
    return this.chooseAttack();
  }
}