const boards = document.querySelectorAll('.board');
export const playerBoard = document.getElementById('player-board');

boards.forEach((b) => {
  const board = b;
  board.style.display = 'grid';
  board.style.border = '1px solid black';
  board.style.gridTemplateColumns = 'repeat(10, max(3.5vw))';
  board.style.gridTemplateRows = 'repeat(10, max(3.5vw))';
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