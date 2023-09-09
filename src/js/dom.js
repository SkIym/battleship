import gameOverSound from '../assets/sfx/game-over2.wav';
import shipHitSound from '../assets/sfx/ship-hit.wav';
import placeShipsSound from '../assets/sfx/placing-ships.wav';
import shipSunkSound from '../assets/sfx/ship-sunk.wav';

const boards = document.querySelectorAll('.board');
export const playerBoard = document.getElementById('player-board');

boards.forEach((b) => {
  const board = b;
  board.style.display = 'grid';
  board.style.border = '1px solid black';
  board.style.backgroundColor = 'rgb(35, 182, 245)';
  board.style.borderRadius = '5px'
  board.style.gridTemplateColumns = 'repeat(10, max(3vw))';
  board.style.gridTemplateRows = 'repeat(10, max(3vw))';
  for(let i = 0; i < 10; i += 1) {
    for(let j = 0; j < 10; j += 1) {
      const tile = document.createElement('div');
      tile.classList.add('tile')
      tile.id = `${i}-${j}`
      tile.style.border = '1px solid black';
      board.appendChild(tile)
    }
  }
})


export const enemyBoard = document.getElementById('computer-board');
export const enemyTiles = document.querySelectorAll('#computer-board > .tile');
export const playerTiles = document.querySelectorAll('#player-board > .tile');
export const turn = document.getElementById('turn-indicator');
export const again = document.getElementById('play-again');
export const start = document.getElementById('start-game');

export const gameOver = new Audio(gameOverSound);
export const shipHit = new Audio(shipHitSound);
export const placingShip = new Audio(placeShipsSound);
export const shipSunk = new Audio(shipSunkSound)