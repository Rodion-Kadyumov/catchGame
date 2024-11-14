import { Game, Position } from "./game";

describe("Game test", () => {
  let game;
  beforeEach(() => {
    //  Создаем новую игру на каждый тест
    game = new Game();
  });

  afterEach(() => {
    // Заканчиваем игру
    game.stop();
  });

  it("should return gridSize", () => {
    // Описание теста
    game = new Game();
    game.settings = {
      gridSize: {
        columns: 10,
        rows: 10,
      },
    };

    const settings = game.settings;
    expect(settings.gridSize.rows).toBe(10);
    expect(settings.gridSize.columns).toBe(10);
  });

  it("should change status", () => {
    game = new Game();

    expect(game.status).toBe("pending");
    game.start();
    expect(game.status).toBe("inProcess");
  });

  it("should units have unique position", () => {
    for (let i = 0; i < 10; i++) {
      game = new Game();
      game.settings = {
        gridSize: {
          columns: 4,
          rows: 3,
        },
      };

      game.start();

      expect([1, 2, 3, 4]).toContain(game.player1.position.x);
      expect([1, 2, 3]).toContain(game.player1.position.y);

      expect([1, 2, 3, 4]).toContain(game.player2.position.x);
      expect([1, 2, 3]).toContain(game.player2.position.y);

      expect(
        (game.player1.position.x !== game.player2.position.x ||
          game.player1.position.y !== game.player2.position.y) &&
          (game.player1.position.x !== game.macGuffin.position.x ||
            game.player1.position.y !== game.macGuffin.position.y) &&
          (game.player2.position.x !== game.macGuffin.position.x ||
            game.player2.position.y !== game.macGuffin.position.y),
      ).toBe(true);
      game.stop();
    }
  });

  it("should Google change position", async () => {
    for (let i = 0; i < 10; i++) {
      game = new Game();
      game.settings = {
        gridSize: {
          columns: 4,
          rows: 1,
        },
        googleJumpInterval: 100,
      };

      game.start();
      const prevPosition = game.google.position.copy();
      await sleep(150);

      expect(Position.equals(prevPosition, game.google.position)).toBe(false);
      game.stop();
    }
  });

  const sleep = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  it("should google be caught by player1 or player2 for one row", async () => {
    for (let i = 0; i < 10; i++) {
      game = new Game();
      game.settings = {
        gridSize: {
          columns: 3,
          rows: 1,
        },
        MacGuffinJumpInterval: 100,
      };
      game.start();
      const diffForPlayer1 =
        game.macGuffin.position.x - game.player1.position.x;
      const prevMacGuffinPosition = game.macGuffin.position.clone();
      if (Math.abs(diffForPlayer1) === 2) {
        const diffForPlayer2 =
          game.macGuffin.position.x - game.player2.position.x;
        if (diffForPlayer2 > 0) {
          game.movePlayer2Right();
        } else {
          game.movePlayer2Left();
        }
        expect(game.score[1].points).toBe(0);
        expect(game.score[2].points).toBe(1);
      } else {
        if (diffForPlayer1 > 0) {
          game.movePlayer1Right();
        } else {
          game.movePlayer1Left();
        }
        expect(game.score[1].points).toBe(1);
        expect(game.score[2].points).toBe(0);
      }
      expect(
        Position.equals(game.macGuffin.position, prevMacGuffinPosition),
      ).toBe(false);
      game.stop();
    }
  });

  it("should google be caught by player1 or player2 for one column", async () => {
    for (let i = 0; i < 10; i++) {
      game = new Game();
      game.settings = {
        gridSize: {
          columns: 1,
          rows: 3,
        },
      };
      game.start();
      const diffForPlayer1 =
        game.macGuffin.position.y - game.player1.position.y;
      const prevMacGuffinPosition = game.macGuffin.position.clone();
      if (Math.abs(diffForPlayer1) === 2) {
        const diffForPlayer2 =
          game.macGuffin.position.y - game.player2.position.y;
        if (diffForPlayer2 > 0) {
          game.movePlayer2Down();
        } else {
          game.movePlayer2Up();
        }
        expect(game.score[1].points).toBe(0);
        expect(game.score[2].points).toBe(1);
      } else {
        if (diffForPlayer1 > 0) {
          game.movePlayer1Down();
        } else {
          game.movePlayer1Up();
        }
        expect(game.score[1].points).toBe(1);
        expect(game.score[2].points).toBe(0);
      }
      expect(
        Position.equals(game.macGuffin.position, prevMacGuffinPosition),
      ).toBe(false);
      game.stop();
    }
  });

  it("first or second player wins", () => {
    game = new Game();
    game.settings = {
      pointsToWin: 3,
      gridSize: {
        columns: 3,
        rows: 1,
      },
    };
    game.start();
    const diffForPlayer1 = game.macGuffin.position.x - game.player1.position.x;
    if (Math.abs(diffForPlayer1) === 2) {
      const diffForPlayer2 =
        game.macGuffin.position.x - game.player2.position.x;
      if (diffForPlayer2 > 0) {
        game.movePlayer2Right();
        game.movePlayer2Left();
        game.movePlayer2Right();
      } else {
        game.movePlayer2Left();
        game.movePlayer2Right();
        game.movePlayer2Left();
      }
      expect(game.status).toBe("finished");
      expect(game.score[1].points).toBe(0);
      expect(game.score[2].points).toBe(3);
    } else {
      if (diffForPlayer1 > 0) {
        game.movePlayer1Right();
        game.movePlayer1Left();
        game.movePlayer1Right();
      } else {
        game.movePlayer1Left();
        game.movePlayer1Right();
        game.movePlayer1Left();
      }
      expect(game.status).toBe("finished");
      expect(game.score[1].points).toBe(3);
      expect(game.score[2].points).toBe(0);
    }
  });
});
