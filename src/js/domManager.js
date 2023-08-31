import * as dom from './dom';

export default class BoardRenderer {
  constructor(game) {
    this.game = game;
    this.tiles = dom.tiles;
  }

  init() {
    let tileNo = 0;
    this.tiles.forEach((tile) => {
      const id = tileNo;
      tile.addEventListener('click', () => {
        const coord = [
          parseInt(tile.id.charAt(0), 10), 
          parseInt(tile.id.charAt(2), 10)
        ];
        this.game.playerAttacks(coord, id);
      });
      tileNo += 1;
    });
    this.game.on('hit', id => this.renderHit(id));
    this.game.on('miss', id => this.renderMiss(id));
  }

  renderHit(id) {
    this.tiles[id].style.backgroundColor = 'red';
  }

  renderMiss(id) {
    this.tiles[id].style.backgroundColor = 'gray';
  }
}