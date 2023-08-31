import * as dom from './dom';

export default class BoardRenderer {
  constructor(game) {
    this.game = game;
    this.enemyBoard = dom.enemyBoard;
    this.playerBoard = dom.playerBoard;
    this.tiles = dom.enemyTiles;
    this.turnUI = dom.turn;
  }

  init() {
    let tileNo = 0;
    this.tiles.forEach((tile) => {
      const id = tileNo;
      tile.addEventListener('click', (e) => {
        const coord = [
          parseInt(tile.id.charAt(0), 10), 
          parseInt(tile.id.charAt(2), 10)
        ];
        this.game.playerAttacks(coord, id);
        e.target.style.pointerEvents = 'none';
      });
      tileNo += 1;
    });
    this.game.on('hit', (id) => {
      this.renderHit(id);
      this.toggleTiles();
    });
    this.game.on('miss', (id) => {
      this.renderMiss(id)
      this.toggleTiles();
    });
  }

  renderHit(id) {
    this.tiles[id].style.backgroundColor = 'red';
  }

  renderMiss(id) {
    this.tiles[id].style.backgroundColor = 'gray';
  }

  toggleTiles() {
    this.tiles = (this.tiles === dom.enemyTiles) ? dom.playerTiles : dom.enemyTiles 
  }

}