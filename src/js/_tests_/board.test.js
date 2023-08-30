import b from "../gameboard";
import Ship from '../ship';

const Gameboard = new b();

describe('Gameboard Class', () => {

  test('Places ship at a specified coordinate', () => {
    const ship = new Ship(2);
    Gameboard.init()
    Gameboard.placeShip([4,8], ship)
    expect(Gameboard.board[4][8]).toBe(ship);
    expect(Gameboard.board[4][9]).toBe(ship);
  });

  test('Rejects placing invalid ships', () => {
    const ship = new Ship(3);
    Gameboard.init()
    Gameboard.placeShip([4,8], ship)
    expect(Gameboard.board[4][8]).toBe(null);
  });

  test('Board receives hitting attacks', () => {
    const ship = new Ship(1);
    Gameboard.init()
    Gameboard.placeShip([6,9], ship)
    expect(Gameboard.receiveAttack([6,9])).toBe(true);
  });

  test('Gameboard sends hit function to attacked ship', () => {

    const ship = new Ship(2);
    Gameboard.init()
    Gameboard.placeShip([4,8], ship)
    Gameboard.receiveAttack([4,9])

    expect(ship.hits).toBe(1);
  });

  test('Board receives missed attacks', () => {
    const ship = new Ship(2);
    Gameboard.init()
    Gameboard.placeShip([4,8], ship)
    Gameboard.receiveAttack([2, 3])

    expect(Gameboard.missed).toContainEqual([2, 3]);
  });

  // test('Reports if all ships have sunk', () => {
  //   const ship = new Ship(2);
  //   Gameboard.init()
  //   Gameboard.placeShip([4,8], ship)
  //   Gameboard.receiveAttack([4, 8])
  //   Gameboard.receiveAttack([4, 9])

  //   expect(Gameboard.shipsHaveSunk()).toEqual(true);
  // });

});

