import { START_DATE } from "./constants";

export const getCurrentDailySeed = () => {
  return ((new Date().getTime() - START_DATE.getTime()) / (1000 * 5)) >> 0;
};
