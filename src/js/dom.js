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

const buildShip = (length, dir) => {
  const ship = document.createElement('div');
  ship.style.display = 'grid';
  if (dir) {
    ship.style.gridTemplateColumns = `repeat(${length}, 40px)`;
    ship.style.gridTemplateRows = `40px`;
  } else {
    ship.style.gridTemplateRows = `repeat(${length}, 40px)`;
    ship.style.gridTemplateColumns = `40px`;
  }
  
  for(let i = 0; i < length; i += 1) {
    const part = document.createElement('div');
    part.style.backgroundColor = 'yellow';
    part.style.border = '1px solid black';
    part.style.cursor = 'grab';
    ship.appendChild(part)
  }
  return ship

}

export const initPlayerShips = (SHIP_LENGTHS) => {

  SHIP_LENGTHS.forEach((length) => {
    const dir = Math.random() > 0.5
    const ship = buildShip(length, dir);
    ship.style.position = 'absolute';
    ship.style.top = `calc(${parseInt(Math.random() * 10, 10)} * 10%)`;
    ship.style.left = `calc(${parseInt(Math.random() * 10, 10)} * 10%)`;
    
    playerBoard.appendChild(ship)
    })

}


export const enemyBoard = document.getElementById('computer-board');
export const enemyTiles = document.querySelectorAll('#computer-board > .tile');
export const playerTiles = document.querySelectorAll('#player-board > .tile');
export const turn = document.getElementById('turn-indicator');
export const again = document.getElementById('play-again')