// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {BoatRacing} from "./06-boat-racing";

expect.extend(matchers);

test("Day 6 puzzle a sample", () => {
  const input = `Time:      7  15   30
Distance:  9  40  200`;

  const boatRacing = new BoatRacing(input);
  expect(boatRacing.winningRaceProduct).toEqual(288);
  expect(boatRacing.bigRaceWinCount).toEqual(71503);
});

test("Day 6 puzzle input sample", () => {
  const input = `Time:        45     98     83     73
Distance:   295   1734   1278   1210`;

  const boatRacing = new BoatRacing(input);
  expect(boatRacing.winningRaceProduct).toEqual(1413720);
  expect(boatRacing.bigRaceWinCount).toEqual(30565288);
});
