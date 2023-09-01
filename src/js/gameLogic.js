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

  init() {
    this.player.setBoard([[[6, 5], new Ship(3)]])
    this.computer.setBoard([[[6, 5], new Ship(3)]])
    this.on('turnEnd', (currentPlayer) => {
      if (currentPlayer.name === 'comp') {
        setTimeout(() => this.computerAttacks(), 400)
      }
    })
  }

  playerAttacks(coord, id) {
    const hit = this.player.attackEnemy(coord);
    if (hit) this.emit('hit', id);
    else this.emit('miss', id);
    this.emit('turnEnd', this.computer)
  }

  computerAttacks() {
    const hit = this.computer.chooseAttack();
    const id = this.computer.targetTile[0] * 10 + this.computer.targetTile[1];
    if (hit) this.emit('hit', id);
    else this.emit('miss', id);
    this.emit('turnEnd', this.player)
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