export type GameMode = "daily" | "free";
export type GameData = {
  seed: number;
  guesses: string[];
  answers: string[];
  current: string;
};
export type GamesData = { [key in GameMode]: GameData };
export type GamesDataProviderFuncs = {
  sendKey(mode: GameMode, e: KeyboardEvent): void;
  isGameComplete(mode: GameMode): boolean;
  addLetter(mode: GameMode, letter: string): void;
  deleteLetter(mode: GameMode): void;
  submitCurrent(mode: GameMode): void;
  resetDailyIfOld(): void;
};
