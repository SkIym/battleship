import Game from "./gameLogic";
import BoardRenderer from "./domManager";

export default class GameManager {
  constructor() {
    this.game = new Game();
    this.domManager = new BoardRenderer(this.game);
  }

  init() {
    this.game.init();
    this.domManager.init();
    this.listenForNewGame();
  }

  listenForNewGame() {
    this.domManager.on('reset', () => {
      this.game.reset();
      this.game.init();
      this.domManager.reset(this.game);
      this.listenForNewGame();
    })
  }
}