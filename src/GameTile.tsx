import { Component, createMemo } from "solid-js";
import { ALLOWED, ANSWERS, NUM_GAMES_X } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { GameMode } from "./types";

type GameTileProps = {
  mode: GameMode;
  gameX: number;
  gameY: number;
  gameCol: number;
  gameRow: number;
};
const GameTile: Component<GameTileProps> = (props) => {
  const { mode, gameX, gameY, gameCol, gameRow } = props;
  const gameIndex = gameX + gameY * NUM_GAMES_X;

  const [gamesData] = useGamesDataContext();

  const shouldRenderLetter = createMemo(() => {
    const gameData = gamesData[mode];
    const guesses = gameData.guesses;
    const answer = gameData.answers[gameIndex];
    const answerIndex = guesses.indexOf(answer);
    return gameRow <= answerIndex || answerIndex === -1;
  });

  const letter = createMemo(() => {
    const gameData = gamesData[mode];
    const guesses = gameData.guesses;
    const current = gameData.current;
    let letter: string | undefined;
    if (!shouldRenderLetter()) {
      return letter;
    } else if (gameRow < guesses.length) {
      letter = guesses[gameRow][gameCol];
    } else if (gameRow === guesses.length) {
      letter = current[gameCol];
    }
    return letter?.toUpperCase();
  });

  const boxClasses = createMemo(() => {
    const gameData = gamesData[mode];
    const guesses = gameData.guesses;
    const answers = gameData.answers;
    const current = gameData.current;
    const classes = [];
    if (shouldRenderLetter()) {
      if (gameRow < guesses.length) {
        if (guesses[gameRow][gameCol] === answers[gameIndex][gameCol]) {
          classes.push("box-success");
        } else if (
          answers[gameIndex].indexOf(guesses[gameRow][gameCol]) !== -1
        ) {
          classes.push("box-diff");
        }
      }
      if (
        gameRow === guesses.length &&
        current.length === 5 &&
        ALLOWED.indexOf(current) === -1 &&
        ANSWERS.indexOf(current) === -1
      ) {
        classes.push("text-invalid");
      }
    }
    return classes.join(" ");
  });

  return (
    <div
      class={`box pb-[20%]  ${gameRow === 0 ? "border-t-[1px]" : ""} ${
        gameCol === 0 ? "border-l-[1px]" : ""
      } ${boxClasses()}`}
    >
      <div
        class="box-content"
        id={`box${gameIndex + 1},${gameRow + 1},${gameCol + 1}`}
      >
        {letter()}
      </div>
    </div>
  );
};

export default GameTile;
