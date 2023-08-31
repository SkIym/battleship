import Game from "./gameLogic";
import DOMManager from "./domManager";

export default class GameManager {
  constructor() {
    this.game = new Game();
    this.domManager = new DOMManager(this.game);
  }

  init() {
    this.game.init();
    this.domManager.init();
  }
}