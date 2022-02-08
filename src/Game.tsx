import { Component, onCleanup } from "solid-js";
import {
  BOX_SIZE,
  GAME_COLS,
  GAME_ROWS,
  NUM_GAMES_X,
  NUM_GAMES_Y,
} from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import GameSquare from "./GameTile";
import Keyboard from "./Keyboard";
import { GameMode } from "./types";

export const GAME_WIDTH = BOX_SIZE * GAME_COLS * NUM_GAMES_X + 4;

type GameProps = {
  mode: GameMode;
};
const Game: Component<GameProps> = (props) => {
  const { mode } = props;
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  const keyEventListener = (e: KeyboardEvent) => {
    gamesDataFuncs.sendKey(mode, e);
  };
  document.addEventListener("keydown", keyEventListener);
  onCleanup(() => document.removeEventListener("keydown", keyEventListener));
  // wowo very cool
  return (
    <div
      class={`overflow-auto max-w-[550px] w-full h-full m-auto flex flex-col flex-1`}
    >
      <div class="flex-1 overflow-auto">
        <div class="w-full flex-col">
          {[...Array(NUM_GAMES_Y).keys()].map((gameY) => (
            <div class="flex w-full">
              {[...Array(NUM_GAMES_X).keys()].map((gameX) => {
                return (
                  <div
                    class={`flex flex-col flex-auto ${
                      gameX === 0 ? "mr-[4px]" : "ml-[4px]"
                    } ${gameY === 0 ? "mb-[4px]" : "mt-[4px]"}`}
                  >
                    {[...Array(GAME_ROWS).keys()].map((rowIndex) => (
                      <div class="flex w-full">
                        {[...Array(GAME_COLS).keys()].map((colIndex) => (
                          <GameSquare
                            mode={mode}
                            gameX={gameX}
                            gameY={gameY}
                            gameRow={rowIndex}
                            gameCol={colIndex}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <Keyboard mode={mode} />
    </div>
  );
};

export default Game;
