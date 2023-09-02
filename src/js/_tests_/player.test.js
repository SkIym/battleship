import Player from '../player';
import Ship from '../ship';
import Gameboard from '../gameboard';



describe('Player Class', () => {
  test('Sets board pieces', () => {
    const player = new Player('adf', new Gameboard(), new Gameboard());
    const ship = new Ship(2);
    const ship2 = new Ship(1);
    
    player.setBoard([[[3, 4], ship], [[5, 6], ship2]])

    expect(player.playerBoard.board[3][4]).toBe(ship);
    expect(player.playerBoard.board[3][5]).toBe(ship);
    expect(player.playerBoard.board[5][6]).toBe(ship2);

  });

  test('Attacks the enemy board', () => {
    const enemy = new Gameboard();
    const ship = new Ship(2);
    enemy.placeShip([3,4], ship);
    const player = new Player('adf', enemy, new Gameboard());
    player.attackEnemy([3, 4]);
    expect(enemy.shipParts).toEqual(1);

  });

  test('If computer, chooses a random move', () => {
    const enemy = new Gameboard();
    const ship = new Ship(2);
    enemy.placeShip([3,4], ship);
    const computer = new Player('adf', enemy, new Gameboard());

    computer.chooseAttack()

    expect(enemy.missed.length).toEqual(1);

  });

  test('If computer, chooses a valid move', () => {
    const enemy = new Gameboard();
    const ship = new Ship(2);
    enemy.placeShip([3,4], ship);
    const computer = new Player('adf', enemy, new Gameboard(), [[0, 6]]);

    computer.chooseAttack()

    expect(enemy.missed.length).not.toEqual(0);

  });

  // test('If computer, continue attacking near tile that hit', () => {
  //   const enemy = new Gameboard();
  //   const ship = new Ship(2);
  //   enemy.placeShip([3,4], ship);
  //   const computer = new Player('adf', enemy, new Gameboard());

  //   while (true) {
  //     const attack = (coord = [3, 4]) => computer.attackEnemy(coord);
  //     if (hit) {
  //       attack(nextAttack(coord))
  //     } else {
  //       break
  //     }
  //   }

  //   expect(enemy.shipParts).toEqual(0);

  // });

});

