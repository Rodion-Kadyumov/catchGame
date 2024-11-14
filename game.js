export class Game {
  // Создали класс

  #settings = {
    // Метод под тест 'should return gridSize', # - приватный
    gridSize: {
      columns: 4,
      rows: 4,
    },
    googleJumpInterval: 2000,
    pointsToWin: 3,
  };
  #status = "pending";
  #player1;
  #player2;
  #google;
  #googleJumpIntervalId;
  #score = {
    1: { points: 0 },
    2: { points: 0 },
  };
  constructor(eventEmmiter) {
    this.eventEmmiter = eventEmmiter;
  }

  #getRandomPostion(takenPosition = []) {
    // Для получения разных позиций
    let newX;
    let newY;
    do {
      newX = NumberUtil.getRandomNumber(this.#settings.gridSize.columns);
      newY = NumberUtil.getRandomNumber(this.#settings.gridSize.rows);
    } while (
      takenPosition.some(
        (position) => position.x === newX && position.y === newY,
      )
    );

    return new Position(newX, newY);
  }

  #moveGoogleToRandomPosition(isStartPosition) {
    const googlePosition = isStartPosition
      ? this.#getRandomPostion([this.player1.position, this.player2.position])
      : this.#getRandomPostion([
          this.player1.position,
          this.player2.position,
          this.#google.position,
        ]);
    this.#google = new Google(googlePosition);

    this.eventEmmiter.emit("changePosition");
  }

  #createUnits() {
    const player1Position = this.#getRandomPostion();
    this.#player1 = new Player(1, player1Position);

    const player2Position = this.#getRandomPostion([player1Position]);
    this.#player2 = new Player(2, player2Position);

    this.#moveGoogleToRandomPosition(true);
  }

  get status() {
    // Чтобы получить status
    return this.#status;
  }

  get score() {
    // Чтобы получить score
    return this.#score;
  }

  set settings(settings) {
    //this.#settings = settings;
    this.#settings = { ...this.#settings, ...settings };

    this.#settings.gridSize = settings.gridSize
      ? { ...this.#settings.gridSize, ...settings.gridSize }
      : this.#settings.gridSize;
  }

  get settings() {
    // Чтобы получить settings
    return this.#settings;
  }

  get player1() {
    // Чтобы получить player1
    return this.#player1;
  }

  get player2() {
    // Чтобы получить player2
    return this.#player2;
  }

  get google() {
    // Чтобы получить google
    return this.#google;
  }

  #startGoogleJumpInterval() {
    this.#googleJumpIntervalId = setInterval(() => {
      this.#moveGoogleToRandomPosition(false);
    }, this.#settings.googleJumpInterval);
  }

  start() {
    if (this.#status === "pending") {
      this.#status = "inProcess";
    }
    this.#createUnits();
    this.#startGoogleJumpInterval();
  }

  stop() {
    this.#status = "finished";
    clearInterval(this.#googleJumpIntervalId);
  }

  #isBorder(movingPlayer, step) {
    let prevPlayerPosition = movingPlayer.position.copy();

    if (step.x) {
      prevPlayerPosition.x += step.x;
      return (
        prevPlayerPosition.x < 1 ||
        prevPlayerPosition.x > this.#settings.gridSize.columns
      );
    }
    if (step.y) {
      prevPlayerPosition.y += step.y;
      return (
        prevPlayerPosition.y < 1 ||
        prevPlayerPosition.y > this.#settings.gridSize.rows
      );
    }
  }

  #isOtherPlayer(movingPlayer, otherPlayer, step) {
    let prevPlayerPosition = movingPlayer.position.copy();
    if (step.x) {
      prevPlayerPosition.x += step.x;
    }
    if (step.y) {
      prevPlayerPosition.y += step.y;
    }
    return Position.equals(prevPlayerPosition, otherPlayer.position);
  }

  #checkGoogleCatching(movingPlayer) {
    if (Position.equals(movingPlayer.position, this.#google.position)) {
      this.#score[movingPlayer.id].points += 1;
      this.#moveGoogleToRandomPosition(false);
    }
    if (this.#score[movingPlayer.id].points === this.#settings.pointsToWin) {
      this.#google = new Google(new Position(0, 0));
      this.stop();
      return;
    }

    clearInterval(this.#googleJumpIntervalId);
    this.#startGoogleJumpInterval();
  }

  #movePlayer(movingPlayer, otherPlayer, step) {
    const isBorder = this.#isBorder(movingPlayer, step);
    const isOtherPlayer = this.#isOtherPlayer(movingPlayer, otherPlayer, step);
    if (isBorder || isOtherPlayer) {
      return;
    }
    if (step.x) {
      movingPlayer.position.x += step.x;
    }
    if (step.y) {
      movingPlayer.position.y += step.y;
    }
    this.#checkGoogleCatching(movingPlayer);

    this.eventEmmiter.emit("changePosition");
  }

  movePlayer1Right() {
    // Возможность хода
    const step = { x: 1 };
    this.#movePlayer(this.#player1, this.#player2, step);
  }
  movePlayer1Left() {
    const step = { x: -1 };
    this.#movePlayer(this.#player1, this.#player2, step);
  }
  movePlayer1Up() {
    const step = { y: -1 };
    this.#movePlayer(this.#player1, this.#player2, step);
  }
  movePlayer1Down() {
    const step = { y: 1 };
    this.#movePlayer(this.#player1, this.#player2, step);
  }

  movePlayer2Right() {
    const step = { x: 1 };
    this.#movePlayer(this.#player2, this.#player1, step);
  }
  movePlayer2Left() {
    const step = { x: -1 };
    this.#movePlayer(this.#player2, this.#player1, step);
  }
  movePlayer2Up() {
    const step = { y: -1 };
    this.#movePlayer(this.#player2, this.#player1, step);
  }
  movePlayer2Down() {
    const step = { y: 1 };
    this.#movePlayer(this.#player2, this.#player1, step);
  }
  pause() {}
  resume() {}
}

export class Units {
  constructor(position) {
    this.position = position;
  }
}
export class Player extends Units {
  constructor(id, position) {
    super(position);
    this.id = id;
  }
}

export class Google extends Units {
  constructor(position) {
    super(position);
  }
}

export class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  copy() {
    return new Position(this.x, this.y);
  }
  static equals(somePosition1, somePosition2) {
    return (
      somePosition1.x === somePosition2.x && somePosition1.y === somePosition2.y
    );
  }
}

class NumberUtil {
  //  Генерации разных координат для разных стартовых позиций
  static getRandomNumber(max) {
    return Math.floor(Math.random() * max + 1);
  }
}
