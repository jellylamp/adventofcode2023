// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {PipeMaze} from "./10-pipe-maze";
import {LightEmitter} from "./16-light-emitter";

expect.extend(matchers);

test("Day 10 puzzle a small simplified loop", () => {
  const input = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

  const lightEmitter = new LightEmitter(input);
  expect(lightEmitter.visited.size).toEqual(46);
});
