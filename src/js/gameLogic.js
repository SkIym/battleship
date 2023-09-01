import Player from "./player";
import Gameboard from "./gameboard";
import Ship from "./ship";
// import BoardRenderer from "./view";

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
    this.computer.setBoard([[[6, 5], new Ship(3)]])
    this.computer.setBoard([[[4, 3], new Ship(2)]])
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