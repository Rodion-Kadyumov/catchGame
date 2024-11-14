import { EvenEmmiter } from "./eventEmitter.js";
import { Game } from "./game.js";

const eventEmmiter = new EvenEmmiter();
const game = new Game(eventEmmiter);                   // Создали игру
game.settings.gridSize = {
  rows: 4,
  columns: 5,
};
const tableElement = document.getElementById("field"); // Ищем табличку по id
const score1 = document.getElementById("score1");      // Вывели очки игрока
const score2 = document.getElementById("score2");

game.start();

window.addEventListener("keydown", (e) => {            // Передвижение игроков
  switch (e.key) {
    case "ArrowUp":
      game.movePlayer1Up();
      break;
    case "ArrowDown":
      game.movePlayer1Down();
      break;
    case "ArrowLeft":
      game.movePlayer1Left();
      break;
    case "ArrowRight":
      game.movePlayer1Right();
      break;
    case "w":
      game.movePlayer2Up();
      break;
    case "s":
      game.movePlayer2Down();
      break;
    case "a":
      game.movePlayer2Left();
      break;
    case "d":
      game.movePlayer2Right();
      break;
  }
});

const render = () => {                                    //  Для передвижения гугла
  tableElement.innerHTML = "";                            // Зачистка содержимого таблицы
  score1.innerHTML = "";
  score2.innerHTML = "";

  score1.append(game.score[1].points);
  score2.append(game.score[2].points);

  for (let y = 1; y <= game.settings.gridSize.rows; y++) {
    const trElement = document.createElement("tr");       //  Создали ряды
    tableElement.append(trElement);                       // Отрисовали

    for (let x = 1; x <= game.settings.gridSize.columns; x++) {
      const tdElement = document.createElement("td");     //  Создали колонки
      trElement.append(tdElement);                        // Отрисовали

      if (game.google.position.x === x && game.google.position.y === y) {
        const imgElement = document.createElement("img"); // Создали картинку гугл
        imgElement.src = "./assets/google.png";
        imgElement.alt = "google image";
        tdElement.append(imgElement);                     // Отрисовали картинку в ячейку
      }

      if (game.player1.position.x === x && game.player1.position.y === y) {
        const imgElement = document.createElement("img");
        imgElement.src = "./assets/first.png";
        imgElement.alt = "Player 1";
        tdElement.append(imgElement);
      }

      if (game.player2.position.x === x && game.player2.position.y === y) {
        const imgElement = document.createElement("img");
        imgElement.src = "./assets/second.png";
        imgElement.alt = "Player 2";
        tdElement.append(imgElement);
      }
    }
  }
};

render();
game.eventEmmiter.subscribe("changePosition", render);
