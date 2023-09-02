import Player from "./player";
import Gameboard from "./gameboard";
import Ship from "./ship";

// 1 four
// 2 three
// 3 two
// 4 one

const SHIP_LENGTHS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]

export default class Game {

  constructor() {
    this.playerBoard = new Gameboard();
    this.enemyBoard = new Gameboard();
    this.player = new Player('player', this.enemyBoard, this.playerBoard);
    this.computer = new Player('comp', this.playerBoard, this.enemyBoard);
    this.eventListeners = {};
    this.currentPlayer = this.player;
  }

  reset() {
    this.playerBoard.reset();
    this.enemyBoard.reset();
    this.player.reset();
    this.computer.reset();
    this.currentPlayer = this.player;
    this.eventListeners = {};
  }

  init() {
    this.player.setBoard([[[5, 1], new Ship(1)]])
    this.placeComputerShips();
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

  placePlayerShips() {
    
  }

  placeComputerShips() {
    // this.computer.setBoard([[[6, 5], new Ship(3)]])
    // this.computer.setBoard([[[4, 3], new Ship(2)]])
    SHIP_LENGTHS.forEach((length) => {
      const dir = Math.random() > 0.5
      this.placeComputerShipsHelper(length, dir)
      })
  }

  placeComputerShipsHelper(length, dir) {
    if (this.enemyBoard.placeShip([parseInt(Math.random() * 10, 10), parseInt(Math.random() * 10, 10)], new Ship(length), dir)) return true
    return this.placeComputerShipsHelper(length, dir)
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