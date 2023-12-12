// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {HotSprings} from "./12-hotsprings";

expect.extend(matchers);

test("Day 8 puzzle a sample", () => {
  const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

  const hotSprings = new HotSprings(input);
  expect(hotSprings.possibleSum).toEqual(21);
});

test("Day 8 puzzle a input", () => {
  const input = `........#.........................................................................................................#..................#......
.............#.......................#....................................#......#......................#.......................#...........
...............................#...........#...........................................................................#....................
.........................#...........................#.......................................#...........................................#..
.....#...............................................................................#......................................................
....................................................................................................................................#.......
...........................................................#..............................#................#.......#........................
..........#..........#............#..................................#......#...............................................................
.........................................#..................................................................................................
#..............#.............#.......................#........................................#.......................#.....................
......#..........................................................................#......#...........#.......................................
................................................................................................................#...........................
............#...........#...............................#..............#...................................#................................
....................................#................................................#.....................................#................
...#.............#..............................................#...........................................................................
.......................................................................................................#....................................
.........#.....................#...............................................................#............................................
.........................................................................................................................................#..
#...............................................................................#.....................................#.....................
......#...........#.................#..........#.........................................#..................................................
...........#............#..............................#..............#..........................................#..........................
...................................................................................#..............#...........................#.............
..................................................#.........................................................................................
.............................................#............................................................................#.............#...
.........................................................................................................#..................................
.....#........................#...........................#.....#..............#............#...............................................
................#................................................................................................................#..........
................................................#.............................................................#.............................
..........................#..........#.......................#.....................#.....#...........#......................................
............#......#........................#.....................#.....#.....................#........................#...................#
............................................................................................................................................
................................#.......................#...................................................................#...............
.....#...................................#...................................................................#........................#.....
....................................#.......................#...............................................................................
.............................................#................................#................#................................#...........
#.....................#.................................................#............................#......................................
.....................................................#............................................................#.......#.........#.......
..................#............................................#...........................................................................#
...............................#.......#..................................................................#.................................
............#..............................................................#.................................................#..............
...................................#........................................................#...............................................
#....................#......................................................................................................................
......#....................................................#.......................................#........................................
...................................................................#...........#...............................................#.....#......
.............................#..................#................................................................#..........................
...................#...............................................................#......................................#.................
............................................................................................................................................
............................................#....................#.................................................................#........
........#......#...............#.......#...........#.........................................#..............................................
........................................................................................#.........#........#................................
............................................................................................................................................
..#..............................................................................#..........................................................
..................................#.......................#.............................................#........#.....................#....
.............#...............#..............#.....................................................................................#.........
............................................................................................................................................
.....................................#.............................#....................#...................................................
..........#.................................................................................................................................
.....#...........................#.......#...............................#..........#........#...............#.....#......#.................
................................................#..................................................#........................................
#.......................................................................................................................................#...
............................................................................................................................................
.....................#................................#........................................#...........#................................
...........#..............#..........................................#......................................................................
....................................#...........................#...............#....................#................#............#......#.
......#..............................................................................#......................................#...............
..............#.................#..............#..........................................#.................................................
...........................................................#.............#..................................................................
.#......................................................................................................................................#...
...............................................................................#.........................#.....#..................#.........
.................................................................#...............................#...................#......................
.......#.........#.....#..................#..........#...............................#......................................................
...........................................................................................................................#................
.............................#........#......................#..............................................#............................#..
........................................................#..........................................#...............#........................
...............................................................................#...................................................#........
............#...................#.......................................................................#...................................
......#....................#................#.........................#.................#.....#.............................................
...................................................#........................................................................................
.....................#...............#.....................................#.............................................#.................#
.........#.........................................................#.................................#......................................
............................................................................................................................................
............................................................................................................................................
.....#...........................................#..........#.....................................#.......#.................................
........................#......#............................................................................................................
..............................................................................#..............#........#.....................................
#.................#.........................#......................................................................#........................
.............#.........................#..................#........................#......................................#.................
........................................................................#...................................................................
....#...................................................................................................#.................................#.
.....................#.............................................#............#.......#.......................................#...........
...............................................#............#..................................#............................................
..............#................#...........................................#............................................#...................
.#.....#....................................................................................................................................
...........................#........#..................#.........#..................................................................#.......
...............................................................................................................................#............
....................#......................#.......................................#...........................#............................
..........#........................................#..........#...............#...................#.........................................
..................................#......................................................................#.................#................
.......................#......................................................................#......................#......................
..................#............................#.................#......#...................................................................
.................................................................................#.............................................#............
............#.................#......#..............................................................................................#.....#.
#.....................................................#....................#.........#..........................#...........................
.....#.....................................#................#...............................................................................
..................................#.........................................................................................#..........#....
................#.......................................................................#......#............................................
........................................#...................................................................................................
.........#.............#.......................#.......................................................#............................#.......
..............................................................................#.............................................................
#.............................#....................................................#........................................................
......................................#.....................#.....................................................#..............#..........
..................................................................#.......................#................#...............................#
...................#..............#...................#..............................................#..................#...................
................................................................................................#...........................................
.......#.....#..............................................................................................................................
..................................................#.................................................................................#.......
......................#..................#........................................#....................#......#...........................#.
.......................................................#.................#................#................................#................
...........................#.......................................#................................................#.......................
.................................................................................................................................#..........
......#..........................................#.............................#......................................................#.....
...................#....................#............................................#..........#...........................................
...........#.........................................#...........#..........................................#...............................
..#..............................#.........................................#...........................................#....................
......................................................................#.................#...................................................
.......................#...................................................................................................#................
...........................................................#......................#..................#........#.............................
.....#................................#.....#.......................................................................#..............#........
#...............................#........................................#.......................#..........................................
........................................................................................................................#...................
.........................................#..................................................................................................
............#.....................................#..................#......#................#........................................#.....
........................................................#......#.......................................#....................................
........#.........#..................#..................................................#.......................#...........................
................................................................................#........................................#.........#........
............................................................................................................#.................#.............
........................................#......#............................................................................................
....................#..............................................................#............#......................................#....
.........#.....................#.........................................#.............................#.......#............................
...#......................#............................#........#......................#...............................#..........#.........`;

  // const observatory = new Observatory(input, 1);
  // expect(observatory.distanceSum).toEqual(10422930);
  //
  // const observatory2 = new Observatory(input, 999999);
  // expect(observatory2.distanceSum).toEqual(699909023130);
});