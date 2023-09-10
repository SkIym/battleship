import Game from "./gameLogic";
import BoardRenderer from "./domManager";

export default class GameManager {
  constructor() {
    this.game = new Game();
    this.domManager = new BoardRenderer(this.game);
  }

  init() {
    this.game.init();
    // Create another module for drag and drop!
    this.domManager.init();
    this.playerShipsPlaced();
    this.reset();
  }

  reset() {
    this.domManager.on("reset", () => {
      this.game.reset();
      this.domManager.reset(this.game);
      this.playerShipsPlaced();
      this.reset();
    });
  }

  playerShipsPlaced() {
    this.game.emit("placed");
  }
}
