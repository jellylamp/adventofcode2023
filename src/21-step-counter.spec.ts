// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {BoatRacing} from "./06-boat-racing";
import {CamelPoker} from "./07-camel-poker";
import {HauntedWasteland} from "./08-haunted-wasteland";
import {Oasis} from "./09-oasis";
import {LavaTrench} from "./18-lava-trench";
import {GearSorting} from "./19-gear-sorting";
import {StepCounter} from "./21-step-counter";

expect.extend(matchers);

const jestConsole = console;

beforeEach(() => {
  global.console = require('console');
});

afterEach(() => {
  global.console = jestConsole;
});

test("Day 20 puzzle a sample - 1 steps", () => {
  const input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

  const stepCounter = new StepCounter(input, 1);
  expect(stepCounter.zeroCounter).toEqual(2);
});

test("Day 20 puzzle a sample - 2 steps", () => {
  const input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

  const stepCounter = new StepCounter(input, 2);
  expect(stepCounter.zeroCounter).toEqual(4);
});

test("Day 20 puzzle a sample - 3 steps", () => {
  const input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

  const stepCounter = new StepCounter(input, 3);
  expect(stepCounter.zeroCounter).toEqual(6);
});

// ...........
// .....###.#.
// .###.##..#.
// ..#0#0.0#..
// ..0.#.#....
// .##0.0####.
// .##.0#...#.
// ...0.0.##..
// .##.#.####.
// .##..##.##.
// ...........
test("Day 20 puzzle a sample - 4 steps", () => {
  const input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

  const stepCounter = new StepCounter(input, 4);
  expect(stepCounter.zeroCounter).toEqual(9);
});

test("Day 20 puzzle a sample 6 steps", () => {
  const input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

  const stepCounter = new StepCounter(input, 6);
  expect(stepCounter.zeroCounter).toEqual(16);
});

test("Day 20 puzzle a input", () => {
  const input = `...................................................................................................................................
...#.......#.##......#.#........#.........#...........................#.......#.....#.#.....#.#.#.......###....#...#..........#..#.
..#..............#.#..#........#........##.##.#.......#..#...............#..#......#.##.....#..#.........#......#......#......#.##.
....#........##....#.....##.....#.##...#....#.#.###.......................#...#...#.#..........#...#........#.............#.....#..
.....#.......###....#...............#.....#...#...#...##.#................#.......##...#..........#...#.......##..#........#.....#.
..........#............................#............#.#.................................#.......#............##............#.#.....
.............#............###.#.#...............#....#.............#.......#.##.....##..#..#............##..........##.............
...............#.#............#...#..#..#.##..#....#...........#..................##......#.#......#.#.#..........#.....#.#...#..#.
..........##.#..#...#.......##.........#.............#.............###...................#.......#...#.#.#.....#####.........##....
....#....#...#..#.....#..##.....#....#.........#..###.............#.#...........#.............#.##........#.#.#....#...##......##..
.......#.....#..#.#...........##.......##..#..#............##..#......#.......................#.......#.....#.#....................
.#..#...#.......#....#......#..#.#..........................#..##...................##.....#.........#.#........#........#...##....
..#...#.#..#...#.#......#....#...........#...#...........#..#.#.#....##..........#.#....#.......##.#....#.....##..........#.....#..
.....#..#...........#.##.#............#.#.##.............#.....##.................#............#..##.....#...........##............
.....#.#....##....#............#......#...#............#....#.......#.#....#........#......#...#........#....#.............#.......
.....#........#.........##.#...#...#.#..#..#..............................#.........#.....................#.#..#..#.#........#..#..
.##.....#..#..........##..#.#........#.#.....#........#............#...#.....#..................#.#.........#...#.....#....###..#..
...............##.....#.#.....#.....##..#..................###...............#.............#.......#....#...............#......#...
...#......#.#.............#..#.......#...#..............#.........#....#....#.......................#...#.......#..#...##......#.#.
..........#..#....#.#....#..#...#....##...#.......#..#.........##...#.#.##....#................#.....#.....#.........#.............
...#..#..#...#..#..#.....................#............#............#####....#..#.........#....#....#..#.............#.#......#.#.#.
......#....#....#.##.......#..##..#................#.....#..#.#................##.........#..##..##...........#..#.................
.....#.#..#......#......#....##...#............##...#.#.#......#.......#.......#..#.........#...#..#.....##...#.....#....#.........
....#..#...#..#...........#..#.#..#...#.............#.#....#...##...........#.#...##........#.....#...#.....#.#...#......#..#.#....
.....#.#...#...#.#...##...#........###.............#..#...##....#............................#..#.........##.......#.....#....#....
........#.##...................##......................#...#.....................#...................#..##.#....#....#.#....##...#.
.####.....#.......#........#..........................................#........#.#.#...........#........#..#....#......#....#..#...
.....#......#..###..#..##.....#.........................#..#...#....#.#.........#..#..................#..##........#....###...##.#.
........#....#......###...#......#..............#......#.....#....#.....#.....#....##........................#.........#..#........
........##..#........#........##.............##.##...#..#.......#.#.......#..##......#...............##..#...#.##...#..#......#....
........##..#..#..##.#..................##......#.#.......##...#......#....###...#.........................#.....#..#..#.#.........
............#......###.#......#............#..#..#...#.........#..#.....#.#...##......#.................#..........#....#.....#....
..#.....##.#.......##........#.......#...#..#.......#......##.#....#.......#..........#....#..............#..#...##...#.#......#.#.
..............#..###......##............#....#.....##.##......##................#..##....................#.......#.##..........#...
............#.#.......##............#........#.##....#..#.........##.#....##.#........#....##...............#............##.##..#..
..#..#..#...#...#....#.#...................###...#....#........##.........#..##......#....#................................#..#....
.#...............##................#.#.......#........#.....#.....###..#.##....##............###.........#....#....................
...................#..#...........#..#.#..............#..#...............#.#.#.........##.........#...........#...####....#..#...#.
..#...#........#.......#........#.....#..##.........##.#......##........#......#.#..#...#........#..........#..........#...#.......
..#....#.#.##.#....##...........#.#..##.....##...##..#...##....#....#....#....###...#...#.........##..................#.#....##..#.
.##........#...#...##........#..#...#.....#.#....###....##.#........#..#.......#.........#...#....#...............#..##....#.....#.
.....#.......#....#..........###.....#..#..........#..#.......##..#......................##..##...............#.#....#..##..##..#..
.#......#...#...#..#.............#.#....#........#......##............####.#.........#.................#..............#..#.#....#..
............#.#.#.............#..........#........##..##....#...............................#.#..#.....................##..##...#..
................................#........#........#.....##....#....#.......#......................#..........................##....
...##.###...#...........#..#.......#.....#................#.#..#......#...#....#..#......#....##......#..##........#..##.#.........
.#.........#...................#.....#.##.##.#.#.......#....#..#...#........##.##..#....##...##...#..#.............##.....#........
....#.......#.#........#.##...#.........#......##.....#....##..##...#......#..#.........#..##......##.#..............##..#....#..#.
.#.......#................#....##......#...#....#.#......#.#..#...............###.........#.##.............###..........###....#...
............#...........#...#......#.#..##......#..##..........#........#...##.........#...#.............#..............#..#.......
.#...#..##.............#........#..###........##................#...##..#......#...#.......#.#.........................##....#.....
.......##..........#......##....#............#..##.......##....##...#.......#...#........##..#.#...##........................#...#.
..#....#...............##...#...#.#.#.....#.#....#...#.........#..#.......#..#..#....#......##...#....##.....#..#.........#......#.
.#..#......................#..#.#....#..#.##..#......###.......................#........#.#....#........#..#....#..................
....#..............................#...##...............#...................#..#...##.#..#.....##......#...##................####..
................................#......#....#...#..#......#.....#..........#..#...##......#............#.....##....#........##.....
...............#...........#........#.#........#.#.#...#..#....#.......#..###..........#.#.#.#......#..#.......#..##.#.............
....................#.#....#.....#........##...#.......#....###.#.........#......#......##.#..#..#...................#.........##..
.#.....................#.........##......#........##..................#..................##..#.........##.#............#...........
............#...##.#..#................#........#......#...................#.#....##...#.#.....#.#.......#..#.....#.....#..........
.................#..............#..#......#......#.........#......#.#..#...#.#....................#...#.....#........#..#........#.
............#.........#....#.......##..#.#...##.....#...##...........#............#..#.#.............#.........#.........#.........
........#.............#......##..#.............#........#....#.##.#....#......#..........#....#....#......#....#.......#...........
............#.#...#..#.......#....#.....##....................#.........###....#.#........#...##.......#....#..##...#.......#......
.........#...#........#...........#......#....#..#...#..........#..............#....#............#..#......#..#...#..#....#........
.................................................................S.................................................................
.........#.###....#........#..##........#.##.#......#.............#..........#.#.#.......#...#..#...#...#....#......#..............
......#..#.....#.......#...##.###...........#..#...#.#.#..................###...#..#......##.#.##......#.......#..##.#......#......
............#........#......#....#...#.#....#....#......#...........#.......##..#......#...#.....#.......##.........#...#..........
...............#...........##.....#...#........#..#...#...........#..#..##....#.................##..#.....##..#.#......#.#.........
.........#....##..#...#.....#.....#.......#.#....#.........##..#.....##....#...#......#............#.......#....#....#...#.......#.
.......................#.#...#....#.#.....##......#............#.....#.#...##........##.....#...##.......##.#......................
..................##..#.#........#...#.#.....#.##........##..#.......###..##......#..........#........#....#..#.#...##.#.......#...
............#..............####...#..#..###.#.##....#.#.##...........#.......##......#.#............#.#........................#...
.#..............#.........#......#.......##...#.......................#.......#........#.......#........#.....#....#...............
...............#......#........#...............#........#..##......###...#.......................#....##.........#.##..........#.#.
...#..##.......#.#...#......#.....#.#...........#..##.###.#...............#.#........#............######.##.#...#..............#...
....##...............#.....##....#.#.....................###..#...#.#...#.#...#.##............##...#..#.#........##.......##.......
....#.#.#............#..#......###............#.#.####............#...###.........#.#...#.....#.##....#..........#.......#...###...
......#.#.#.............#...#....#....#.####.......#.....###........#......#.##......##..#..##.......#..#....##............#.#.....
..##.......#..........#....###.......#.###............#.....##....#....#.#...#.........#........#.......#..#.#.............#...##..
.........#.............#....##.........#....###.......#.....#...#.....#.#...#.#.#.....#....#...........###..#...........#.....#....
.#...#....#.##.........#...##....#..##.#....#.....##..#.#...............#.#...#...#.#.......#.#.#........#..#......................
.......##.#...............#...............#......#..#...##....#...#...#..#.......#.............#......#................#....###..#.
.....#.................#.............#.##.#..#...##.......#.....#........#..#.....#.......#........#..#...#...........#...#.....#..
..#.#....#.#.#..........#.#......#......................##.#.#.#....#....#....#...............#..#.#.................#......#......
...#.......#.....#........#....##...##.....#....##.....#....#..............#......#.....#.....#......#..##.............#.#.....###.
.#..............#.........#..........#..#.....##..##..#...#.......#.##......#...........##.......................#....#..#.........
....###..........................#...#...#..###.#...#...............#...##...#...#.##...#..#...#.#...#...........#.............#...
.................##...........##.......#......#..#..................#.................#....#..#....#.#.............#.##..#....##.#.
..#....#......#.#..................#...#..#........#.....#....#...##......#...###...........#..#..#..........#.............#.......
.#...#..#.##.#...#............#..#..#.#.....#.#..#..#.........##........#.......##.#.......#.....#.#........##..#............#.....
.##...###........#.#..............#...........#....#.##.......#.....##.........#..##.....#..#.................#.##...#...##......#.
...#....#............#.#.........##.###.#.......#..##......##......#####.......#.............#.............#.#.#..#...#..#.....#.#.
...#.###.....##..................#.###......#..#.#.#.#....#..#....#........##.#...#...#..#.....##.......................#.....#..#.
.......##.#..###.........................#..........#...#...#..#.....#.......#.#.....##...#....#.............#....##..#.##.#.......
.#.......#......#.##.................#.....#..#.............##....##.....#..#.#...........##.............#...##...........#........
....#.........##.#..#.................##...#.#.......#.......#.....#....#.....#.#.........#..#........#......#..........#.#........
.#..#...#......#..##.....#..............##.###.......#..#.........##...............#.....#...#........#.........#....#.............
....................#..#....................#....#..#....#..........#....#.....#.........#..#.................#.........#........#.
....................................................#..........#....#..##....##........#............#.........#....#...#.........#.
..#.........#.......#..#..................#.#....#.#..........#..................#..#..#...................#..#....................
..##...#...##....#...#..........##.........................#.#....###.....#.....#....#...........#..#.............#....##....#...#.
....#..#...#.....##...#..#...................#...#.........#.#..#...#............................#.........#..............##.#.....
.......#.......##.#.......#.....................#.....#............####.#.....#....#...............#.#....#......#.#...#...#.......
........#.......#...#.##..#........................#...#...##..........#...#......##..#.......##.....#..#..........................
.....#...#.....#..#.........###..#..............#..#......#.##..........#..##.##.................#...#.##.............#.#.....#..#.
..##..#............###...#..#....#..#.#.......#.......#.##....#.........#.#.#..................#.#...#.#......#.#.#................
...........#.#...............#.....##.................##.#...##.......#.##..#..................##....#.#....#....##.#.....#.....#..
.........#........#...............................#.#..#..#.........##....#..#.#...........#..##.....#..###.......#..#.#.#..#...#..
...........#......#.#.#.......#...#.....##..........#.....#...........##.##...#...........##.#.....#.#..##.#.#......#.......#...#..
..#....##....#....#.........#...#......................#...............#.......#...........#....#........##..#.##.....#.....##.....
....#........#......#....##......#.........#.......#.#......##.....#..##......#.........#...##....#..#..................#......#...
.........#...#..............................................###...........#............#..#......#....#..#...........#.#...........
..#....#.#.#.#.#.............#.#.......#...................#..........#.......................##.#.#..#.#..#...#.......#...........
..................#......#.#....####..###.....................#....#.#....#...........#.#.#....#.........#.##...............#......
.........##.#.#.........#..........#.......###..................#....#.....#..........##..#.#....#.....#..#.......#...#.....#......
.............####.........#...................#..........#.#.#....###....##........#.#..#....#..#..#............##........##.......
........##.#.#..#...........##.#.....##......#.#............##..#..##...................#.#...#..##...####.#..#...........##.#.....
..........#.............##...................#..#..........#.#......#...................#....#.....#..#...#...#.#.............#.#..
......##..#..#.#.#....#..#..#.....##.#..#....#.....#..........#....................#..............#......##.......#.......#..##.#..
.......#.#...#.#..##.#........#.#.#.......#.....##.##...........#.............#...........#....##.#.#.....#.#..........#........#..
..#....#....#..........#...#..........#.#....##......#.......#.#...#.................##..........#.#..##..#..............#....#....
.....................#............#......#..........##...............................#.#.#.#............#...#.....#.....#....#.....
........#..#........#.......................#.....#....#...............................#...............#.#.##...#...#..#.....###...
....#..#.#...#...........#.....#......#......#....#...##....................##........................#.##.....#......#.#......#...
.......#.#.....#......#....#.....#.....#............................................#....#...#...#.....#.#.#............###.#.#....
......#.#.......##...#...#...#.....###..####...#........#.#................#.................#............#.....#..................
...........##..............##...............##..........#..#..............##....#...#...#.##........#......#....#.##.#....#....###.
....#..#.#......#..#.#.........#.....#......#..###.....#.#.......................#.....#......#....#..##....#....#....#.#.#........
...................................................................................................................................`;

  const stepCounter = new StepCounter(input, 64);
  expect(stepCounter.zeroCounter).toEqual(3503);
});