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

  reset(game) {
    this.eventListeners = {};
    this.resetBoard();
    this.game = game;
    this.init();
  }

  init() {
    this.tiles = dom.enemyTiles;
    this.subscribe();
    this.playerPlacingBoard();
    this.playSound('place');
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
  }

  subscribe() {
    this.game.on('hit', async (id) => {
      this.renderHit(id);
      await this.playSound('hit');
      this.toggleTiles();
    });
    this.game.on('miss', async (id) => {
      this.renderMiss(id);
      await this.playSound('miss');
      this.toggleTiles();
    });
    this.game.on('turnEnd', (currentPlayer) => {
      this.updateTurnUI(currentPlayer);
      this.togglePlay(currentPlayer);
    });
    this.game.on('over', (winner) => {
      this.gameOverBoard(winner);
      this.playSound('gameover');
    })
    this.game.on('placed', () => {
      this.highlightPlayerShips();
    })
    this.game.on('block', (id) => {
      this.blockTiles(id);
    })
    this.game.on('firstHit', (id) => {
      this.clueOnFirstHit(id);
    })
    this.game.on('blockIfShipSunk', (ids) => {
      ids.forEach(id => {this.blockTiles(id)})
      this.playSound('sunk');
      if (this.game.currentPlayer.name === 'player') {
        dom.playerIndicator.textContent = 'You sunk a ship!'
      } else {
        dom.compIndicator.textContent = 'Enemy sunk a ship!'
      }
    })

    dom.again.addEventListener('click', () => {
      dom.again.style.display = 'none';
      this.playerPlacingBoard();
      this.emit('reset')
    })

    dom.start.addEventListener('click', () => {
      dom.start.style.display = 'none';
      this.gameStartBoard();
      this.stopSound('place');
    })
  }

  renderHit(id) {
    this.tiles[id].style.backgroundColor = 'white';
    if (this.game.currentPlayer.name === 'player') {
      dom.playerIndicator.textContent = 'You hit a ship!'
    } else {
      dom.compIndicator.textContent = 'Enemy hit a ship!'
    }
  }

  renderMiss(id) {
    this.tiles[id].style.backgroundColor = 'rgb(11, 51, 68)';
    if (this.game.currentPlayer.name === 'player') {
      dom.playerIndicator.textContent = 'You missed'
    } else {
      dom.compIndicator.textContent = 'Enemy missed'
    }
  }

  blockTiles(id) {
    if (this.game.currentPlayer.name === 'player') {
      dom.enemyTiles[id].style.backgroundColor = 'rgb(11, 51, 68)';
      dom.enemyTiles[id].style.pointerEvents = 'none';
    } else {
      dom.playerTiles[id].style.backgroundColor = 'rgb(11, 51, 68)';
      dom.playerTiles[id].style.pointerEvents = 'none';
    }
  }

  clueOnFirstHit(id) {
    const [x,y] = id
    const toHighlight = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
      [x+1, y+1],
      [x+1, y-1],
      [x-1, y+1],
      [x-1, y-1]
    ];

    const tilesToHighlight = this.game.currentPlayer.name === 'player' ? dom.enemyTiles : dom.playerTiles;

    toHighlight.forEach(tile => {
      const [a,b] = tile;
      if (a >= 0 && a <= 9 && b >= 0 && b <= 9) {
        const loc = (a * 10) + b;
        tilesToHighlight[loc].style.backgroundColor = tilesToHighlight[loc].style.backgroundColor === 'rgb(11, 51, 68)' ? 'rgb(11, 51, 68)' : 'rgb(112, 162, 184)';
        if(!this.game.currentPlayer.enemyBoard.board[a][b])
          this.game.currentPlayer.toBlockIfShipSunk.push(loc);
          this.game.currentPlayer.moves.push(tile);
      }
    })
    
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

  playerPlacingBoard() {
    this.turnUI.textContent = 'Place your ships!';
    dom.again.style.display = 'none';
    dom.start.style.display = 'block';
    this.enemyBoard.style.pointerEvents = 'none';
    this.playerBoard.style.pointerEvents = 'auto';
  }

  gameStartBoard() {
    this.turnUI.textContent = "Player's Turn";
    this.enemyBoard.style.pointerEvents = 'auto';
    this.playerBoard.style.pointerEvents = 'none';
  }

  gameOverBoard(winner) {
    this.turnUI.textContent = `${winner} wins!`;
    dom.again.style.display = 'block';
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
    dom.playerIndicator.textContent = '---';
    dom.compIndicator.textContent = '---';
  }

  highlightPlayerShips() {
    dom.playerTiles.forEach((tile) => {
      const coord = [
        parseInt(tile.id.charAt(0), 10), 
        parseInt(tile.id.charAt(2), 10)
      ]
      if (this.game.playerBoard.board[coord[0]][coord[1]]) {
        tile.style.backgroundColor = 'yellow';
      }
    });
  };

  async playSound(sound) {
    if (sound === 'gameover') {
      await dom.gameOver.play();
    } else if (sound === 'hit') {
      await dom.shipHit.play();
    } else if(sound ==='miss') {
      await dom.miss.play();
    } else if(sound === 'place'){
      await dom.placingShip.play();
    } else {
      await dom.shipSunk.play();
    }
  }

  stopSound(sound) {
    if (sound === 'gameover') {
      dom.gameOver.pause();
    } else if (sound === 'hit') {
      dom.shipHit.pause();
    } else if(sound ==='miss') {
      dom.miss.pause();
    } else if(sound === 'place'){
      dom.placingShip.pause();
    } else {
      dom.shipSunk.pause();
    }
  }

  // Subscribe to an event
  on(e, listener) {
    if (!this.eventListeners[e]) {
      this.eventListeners[e] = [];
    }
    this.eventListeners[e].push(listener);
  }

  // Unsubscribe from an event
  off(e, listener) {
    if (this.eventListeners[e]) {
      this.eventListeners[e] = this.eventListeners[e].filter(
        (existingListener) => existingListener !== listener
      );
    }
  }

  // Emit listeners of the event
  emit(e, data) {
    if (this.eventListeners[e]) {
      this.eventListeners[e].forEach((listener) => {
        listener(data);
      });
    }
  }

}