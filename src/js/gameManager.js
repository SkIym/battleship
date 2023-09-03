import Game from "./gameLogic";
import BoardRenderer from "./domManager";

export default class GameManager {
  constructor() {
    this.game = new Game();
    this.domManager = new BoardRenderer(this.game);
  }


  init() {
    this.game.init();
    this.domManager.init(this.game);
    this.domManager.on('reset', () => {
      this.init();
    })
  }
}