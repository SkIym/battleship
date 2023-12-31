import Ship from "../ship";

describe("Ship Class", () => {
  test("ships take hits", () => {
    const ship = new Ship(5);
    ship.hit();
    expect(ship.hits).toBe(1);
  });
  test("ships properly sink", () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
