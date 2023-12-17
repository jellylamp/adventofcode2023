// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {CrucibleDistance} from "./17-crucible-distance";

expect.extend(matchers);

test("Day 17 puzzle a small simplified loop", () => {
  const input = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

  const crucibleDistance = new CrucibleDistance(input);
  // expect(crucibleDistance.heatLost).toEqual(102);
});
