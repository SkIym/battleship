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

  init() {
    this.playerBoard.reset();
    this.enemyBoard.reset();
    this.player.reset();
    this.computer.reset();
    this.currentPlayer = this.player;
    this.eventListeners = {};
    this.playerPlaceShips();
    this.placeShips(this.enemyBoard);
    this.on('turnEnd', (currentPlayer) => {
      if (currentPlayer.name === 'comp') {
        setTimeout(() => this.computerAttacks(), 400)
      }
    })
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
    const hit = this.computer.chooseAttack();
    const id = this.computer.targetTile[0] * 10 + this.computer.targetTile[1];
    const gameOver = this.registerAttack(hit, id);
    if(!gameOver) {
      this.currentPlayer = this.player;
      this.signalTurnEnd();
    }
  }

  registerAttack(hit, id) {
    if (hit) {
      this.emit('hit', id);
    }
    else this.emit('miss', id);
    return this.isGameOver();
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