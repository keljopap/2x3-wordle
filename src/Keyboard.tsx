import type { Component } from "solid-js";
import { BOX_SIZE, KEYBOARD_KEYS } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { GameMode } from "./types";

const KEYBOARD_WIDTH = BOX_SIZE * 10;

type KeyboardProps = {
  mode: GameMode;
};
const Keyboard: Component<KeyboardProps> = (props) => {
  const { mode } = props;
  const [gamesData, gamesDataFuncs] = useGamesDataContext();
  return (
    <div id="keyboard" class="w-full flex-col">
      {KEYBOARD_KEYS.map((row, y) => (
        <div class="flex w-full">
          {row.map((key, x) => (
            <div
              class={`box pb-[10%] key ${y === 0 ? "border-t-[1px]" : ""} ${
                x === 0 ? "border-l-[1px]" : ""
              } ${key === "enter3" ? "border-b-transparent" : ""} ${
                key === "enter1" ? "border-r-transparent" : ""
              }`}
              id={key.toLocaleLowerCase()}
            >
              <div
                class="box-content"
                onClick={() => {
                  gamesDataFuncs.sendKey(
                    mode,
                    new KeyboardEvent("keydown", {
                      keyCode: key.startsWith("enter")
                        ? 13
                        : key === "bs"
                        ? 8
                        : "abcdefghijklmnopqrstuvwxyz".indexOf(
                            key.toLocaleLowerCase()
                          ) + 65,
                      key: key.startsWith("enter")
                        ? "Enter"
                        : key === "bs"
                        ? "Backspace"
                        : key.toLocaleLowerCase(),
                    })
                  );
                }}
              >
                {key === "enter2"
                  ? "\u23CE"
                  : key === "bs"
                  ? "\u232B"
                  : key.startsWith("enter")
                  ? ""
                  : key}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
