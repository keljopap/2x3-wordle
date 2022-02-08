import MersenneTwister from "mersenne-twister";
import { Component, createContext, createEffect, useContext } from "solid-js";
import {
  createStore,
  DeepReadonly,
  produce,
  SetStoreFunction,
  Store,
} from "solid-js/store";
import { ALLOWED, ANSWERS, GAME_ROWS, START_DATE } from "./constants";
import { GameData, GameMode, GamesData, GamesDataProviderFuncs } from "./types";

export const generateWordsFromSeed = (seed: number): string[] => {
  let answers: string[] | undefined;
  const rnd = new MersenneTwister(seed);
  rnd.random_int31();
  rnd.random_int31();
  rnd.random_int31();
  rnd.random_int31();
  do {
    answers = [
      ANSWERS[rnd.random_int31() % ANSWERS.length],
      ANSWERS[rnd.random_int31() % ANSWERS.length],
      ANSWERS[rnd.random_int31() % ANSWERS.length],
      ANSWERS[rnd.random_int31() % ANSWERS.length],
    ];
  } while (
    answers[0] == answers[1] ||
    answers[0] == answers[2] ||
    answers[0] == answers[3] ||
    answers[1] == answers[2] ||
    answers[1] == answers[3] ||
    answers[2] == answers[3]
  );
  return answers;
};

function createLocalStore(): [Store<GamesData>, SetStoreFunction<GamesData>] {
  const date = new Date();
  const currentDailySeed =
    ((date.getTime() - START_DATE.getTime()) / (1000 * 3600 * 24)) >> 0;
  const gamesData: GamesData = {
    daily: {
      seed: 0,
      guesses: [],
      answers: [],
      current: "",
    },
    free: {
      seed: 0,
      guesses: [],
      answers: [],
      current: "",
    },
  };
  (["daily", "free"] as GameMode[]).forEach((mode) => {
    let gameData: GameData;
    try {
      const lastSeed = Number(window.localStorage.getItem("last_" + mode));
      const guesses = window.localStorage.getItem(mode + "_guesses") || "";
      const current = window.localStorage.getItem(mode + "_current") || "";
      if (lastSeed && (mode === "free" || lastSeed === currentDailySeed)) {
        gameData = {
          seed: lastSeed,
          guesses: guesses ? guesses.split(",") : [],
          answers: generateWordsFromSeed(lastSeed),
          current: current,
        };
      } else {
        const seed = mode === "daily" ? currentDailySeed : date.getTime();
        gameData = {
          seed: seed,
          guesses: [],
          answers: generateWordsFromSeed(seed),
          current: "",
        };
      }
    } catch (e) {
      const seed = mode === "daily" ? currentDailySeed : date.getTime();
      gameData = {
        seed: seed,
        guesses: [],
        answers: generateWordsFromSeed(seed),
        current: "",
      };
    }
    gamesData[mode] = gameData;
  });

  const [state, setState] = createStore<GamesData>(gamesData);

  createEffect(() => {
    try {
      (["daily", "free"] as GameMode[]).forEach((mode) => {
        window.localStorage.setItem("last_" + mode, String(state[mode].seed));
        window.localStorage.setItem(
          mode + "_guesses",
          state[mode].guesses.join(",")
        );
        window.localStorage.setItem(mode + "_current", state[mode].current);
      });
    } catch (e) {
      // Do nothing if there is no local storage
    }
  });
  return [state, setState];
}

export const GamesDataContext =
  createContext<[DeepReadonly<GamesData>, GamesDataProviderFuncs]>();

type GamesDataProviderProps = {};
const GamesDataProvider: Component<GamesDataProviderProps> = (props) => {
  const [state, setState] = createLocalStore();
  const isGameComplete = (mode: GameMode) => {
    return (
      state[mode].guesses.length === GAME_ROWS ||
      state[mode].answers.filter((answer) =>
        state[mode].guesses.includes(answer)
      ).length === 4
    );
  };
  const addLetter = (mode: GameMode, letter: string) => {
    setState(
      produce((s) => {
        if (s[mode].current.length < 5 && !isGameComplete(mode)) {
          s[mode].current += letter;
        }
      })
    );
  };
  const deleteLetter = (mode: GameMode) => {
    setState(
      produce((s) => {
        if (s[mode].current.length > 0 && !isGameComplete(mode)) {
          s[mode].current = s[mode].current.slice(0, -1);
        }
      })
    );
  };
  const submitCurrent = (mode: GameMode) => {
    setState(
      produce((s) => {
        if (
          s[mode].current.length === 5 &&
          (ANSWERS.indexOf(s[mode].current) >= 0 ||
            ALLOWED.indexOf(s[mode].current) >= 0) &&
          !isGameComplete(mode)
        ) {
          s[mode].guesses.push(s[mode].current);
          s[mode].current = "";
        }
      })
    );
  };
  const store: [DeepReadonly<GamesData>, GamesDataProviderFuncs] = [
    state,
    {
      sendKey(mode: GameMode, e: KeyboardEvent) {
        if (e.ctrlKey) return;
        if (e.key === "Backspace") {
          deleteLetter(mode);
        } else if (e.key === "Enter") {
          submitCurrent(mode);
        } else {
          const key = e.key.toLowerCase();
          if ("abcdefghijklmnopqrstuvwxyz".indexOf(key) == -1) return;
          addLetter(mode, key);
        }
      },
      isGameComplete,
      addLetter,
      deleteLetter,
      submitCurrent,
      resetDailyIfOld() {
        const date = new Date();
        const currentDailySeed =
          ((date.getTime() - START_DATE.getTime()) / (1000 * 3600 * 24)) >> 0;
        if (currentDailySeed !== state.daily.seed) {
          setState(
            produce((s) => {
              s.daily.seed = currentDailySeed;
              s.daily.guesses = [];
              s.daily.answers = generateWordsFromSeed(currentDailySeed);
              s.daily.current = "";
            })
          );
        }
      },
    },
  ];

  setInterval(() => {
    store[1].resetDailyIfOld();
  }, 5000);

  return (
    <GamesDataContext.Provider value={store}>
      {props.children}
    </GamesDataContext.Provider>
  );
};

export const useGamesDataContext = () => {
  const context = useContext(GamesDataContext);
  if (!context || !context.length)
    throw new Error("GamesDataContext has been used outside provider");
  return context;
};

export default GamesDataProvider;
