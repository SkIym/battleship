import Player from "./player";
import Gameboard from "./gameboard";
import Ship from "./ship";

// 1 four
// 2 three
// 3 two
// 4 one



export default class Game {

  constructor() {
    this.playerBoard = new Gameboard();
    this.enemyBoard = new Gameboard();
    this.player = new Player('player', this.enemyBoard, this.playerBoard);
    this.computer = new Player('comp', this.playerBoard, this.enemyBoard);
    this.eventListeners = {};
    this.currentPlayer = this.player;
    this.shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
  }

  reset() {
    this.playerBoard.reset();
    this.enemyBoard.reset();
    this.player.reset();
    this.computer.reset();
    this.currentPlayer = this.player;
    this.eventListeners = {};
    this.init()
  }

  init() {
    this.playerPlaceShips();
    this.placeShips(this.enemyBoard); // computer (enemy) ships
    this.onTurnEnd();
  }

  playerAttacks(coord, id) {
    const hit = this.player.attackEnemy(coord);
    const gameOver = this.registerAttack(hit, id);
    if(!gameOver) {
      this.currentPlayer = this.computer;
      this.signalTurnEnd();
    }
  }

  computerAttacks() {
    const hit = this.computer.targetShip ? this.computer.continueAttack(this.computer.lastHitTile) : this.computer.chooseAttack();
    const id = this.computer.targetTile[0] * 10 + this.computer.targetTile[1];
    const gameOver = this.registerAttack(hit, id);
    if(!gameOver) {
      this.currentPlayer = this.player;
      this.signalTurnEnd();
    }
  }

  registerAttack(hit, id) {
    if (hit) {
      const shipSunk = hit.isSunk();

      this.emit('hit', id);
      this.currentPlayer.targetShip = hit;
      this.currentPlayer.lastHitTile = this.currentPlayer.targetTile;


      if(this.currentPlayer.targetShip.hits > 1 || shipSunk) {
        this.blockAdjacentTiles(this.currentPlayer.lastHitTile, this.currentPlayer.enemyBoard.board, shipSunk);
      } else {
        this.emit('firstHit', this.currentPlayer.lastHitTile)
      }

      if (shipSunk) {
        this.emit('blockIfShipSunk', this.currentPlayer.toBlockIfShipSunk)
        this.currentPlayer.resetAttackChain();
      }
    }
    else {
      this.emit('miss', id);
    }
    
    return this.isGameOver();
  }

  blockAdjacentTiles([x, y], board, lastTile) {
    const toBlock = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]
    if(lastTile) toBlock.push([x+1, y+1],[x+1, y-1],[x-1, y+1],[x-1, y-1])
    
    toBlock.forEach(move => {
      const [a, b] = move;
      if (a >= 0 && a <= 9 && b >= 0 && b <= 9 && !board[a][b]) {
        this.currentPlayer.moves.push(move);
        const id = (a * 10) + b
        this.emit('block', [id])
      }
    })
    console.log('Blockign')
  }

  
  onTurnEnd() {
    this.on('turnEnd', (currentPlayer) => {
      if (currentPlayer.name === 'comp') {
        setTimeout(() => this.computerAttacks(), 400)
      }
    })
  }

  signalTurnEnd() {
    this.emit('turnEnd', this.currentPlayer)
  }

  isGameOver() {
    const win = this.playerBoard.shipsHaveSunk() || this.enemyBoard.shipsHaveSunk()
    if (win) {
      this.emit('over', this.currentPlayer.name)
      return true
    }
  }

  playerPlaceShips() {
    this.placeShips(this.playerBoard);
    // drag and drop!
  }

  placeShips(board) {
    this.shipLengths.forEach((length) => {
      const dir = Math.random() > 0.5
      this.placeShipsHelper(length, dir, board)
      })
  }

  placeShipsHelper(length, dir, board) {
    if (board.placeShip([parseInt(Math.random() * 10, 10), parseInt(Math.random() * 10, 10)], new Ship(length), dir)) return true
    return this.placeShipsHelper(length, dir, board)
  }

  // pub-sub

  // Subscribe to an event
  on(event, listener) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
  }

  // Unsubscribe from an event
  off(event, listener) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        (existingListener) => existingListener !== listener
      );
    }
  }

  // Emit listeners of the event
  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((listener) => {
        listener(data);
      });
    }
  }

}