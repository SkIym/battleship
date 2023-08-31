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
  }

  init() {
    this.player.setBoard([[[2, 1], new Ship(2)]])
    this.computer.setBoard([[[6, 5], new Ship(3)]])
    // this.startLoop();
  }

  // startLoop() {
    
  // }

  playerAttacks(coord, id) {
    const hit = this.player.attackEnemy(coord);
    if (hit) this.emit('hit', id);
    else this.emit('miss', id);
  }

  // computerAttacks() {

  // }


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


  // Emit listenres of the event
  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((listener) => {
        listener(data);
      });
    }
  }

}