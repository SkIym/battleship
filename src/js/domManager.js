import * as dom from './dom';

export default class BoardRenderer {
  constructor(game) {
    this.game = game;
    this.enemyBoard = dom.enemyBoard;
    this.playerBoard = dom.playerBoard;
    this.tiles = dom.enemyTiles;
    this.turnUI = dom.turn;
    this.eventListeners = {};
    this.setUpTiles();
  }

  init(game) {
    this.tiles = dom.enemyTiles;
    this.eventListeners = {};
    this.resetBoard();
    this.game = game;
    this.subscribe();
    // dom.initPlayerShips(this.game.shipLengths);
  }

  setUpTiles() {
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
    dom.again.textContent = 'Start';
  }

  subscribe() {
    this.game.on('hit', (id) => {
      this.renderHit(id);
      this.toggleTiles();
    });
    this.game.on('miss', (id) => {
      this.renderMiss(id)
      this.toggleTiles();
    });
    this.game.on('turnEnd', (currentPlayer) => {
      this.updateTurnUI(currentPlayer);
      this.togglePlay(currentPlayer);
    });
    this.game.on('over', (winner) => {
      this.disableBoard(winner);
    })

   
    dom.again.addEventListener('click', () => {
      dom.again.style.display = 'none';
      this.emit('reset')
    })
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

  togglePlay(currentPlayer) {
    if(currentPlayer.name === 'player') {
      this.enemyBoard.style.pointerEvents = 'auto';
      this.playerBoard.style.pointerEvents = 'none';
    } else {
      this.enemyBoard.style.pointerEvents = 'none';
      this.playerBoard.style.pointerEvents = 'auto';
    }
  }

  updateTurnUI(currentPlayer) {
    if(currentPlayer.name === 'player') {
      this.turnUI.textContent = "Player's Turn"
    } else {
      this.turnUI.textContent = "Computer's Turn"
    }
  }

  disableBoard(winner) {
    this.turnUI.textContent = `${winner} wins!`;
    dom.again.style.display = 'block';
    dom.again.textContent = 'Play Again';
    this.freezeBoards();
    
  }

  freezeBoards() {
    this.enemyBoard.style.pointerEvents = 'none';
    this.playerBoard.style.pointerEvents = 'none';
  }

  resetBoard() {
    [dom.enemyTiles, dom.playerTiles].forEach((board) => {
      board.forEach((tile) => {
        tile.style.backgroundColor = '';
        tile.style.removeProperty('pointer-events');
      })
    })
    this.turnUI.textContent = 'BATTLESHIP';
    this.togglePlay(this.game.currentPlayer)
  }

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