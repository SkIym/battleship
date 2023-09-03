const boards = document.querySelectorAll('.board');
// const boardContainer = document.querySelectorAll('.board-container');
export const playerBoard = document.getElementById('player-board');

boards.forEach((b) => {
  const board = b;
  board.style.display = 'grid';
  board.style.position = 'relative';
  board.style.border = '1px solid black';
  board.style.gridTemplateColumns = 'repeat(10, 40px)';
  board.style.gridTemplateRows = 'repeat(10, 40px)';
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
export const again = document.getElementById('play-again')