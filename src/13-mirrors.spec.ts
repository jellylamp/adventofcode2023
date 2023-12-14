// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {HotSprings} from "./12-hotsprings";
import {Mirror} from "./13-mirrors";

expect.extend(matchers);

test("Day 13 puzzle a sample", () => {
  const input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

  const mirror = new Mirror(input);
  expect(mirror.runningTotal).toEqual(405);

});

test("Day 13 puzzle a sample broken up first", () => {
  const input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.`;

  const mirror = new Mirror(input);
  expect(mirror.runningTotal).toEqual(5);

});


test("Day 13 puzzle a sample broken up second", () => {
  const input = `#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

  const mirror = new Mirror(input);
  expect(mirror.runningTotal).toEqual(400);
});

