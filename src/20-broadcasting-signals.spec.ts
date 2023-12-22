// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {BoatRacing} from "./06-boat-racing";
import {CamelPoker} from "./07-camel-poker";
import {HauntedWasteland} from "./08-haunted-wasteland";
import {Oasis} from "./09-oasis";
import {LavaTrench} from "./18-lava-trench";
import {GearSorting} from "./19-gear-sorting";
import {BroadcastingSignals} from "./20-broadcasting-signals";

expect.extend(matchers);

const jestConsole = console;

beforeEach(() => {
  global.console = require('console');
});

afterEach(() => {
  global.console = jestConsole;
});

test("Day 20 puzzle a sample simple", () => {
  const input = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

  const buttonSignals = new BroadcastingSignals(input, 1);
  expect(buttonSignals.finalCount).toEqual(32);
});

test("Day 20 puzzle a sample simple 2 - 1 push", () => {
  const input = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

  const buttonSignalsTwice = new BroadcastingSignals(input, 1);
  expect(buttonSignalsTwice.finalCount).toEqual(16);
});

test("Day 20 puzzle a sample simple 2 - 2 pushes", () => {
  const input = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

  const buttonSignalsTwice = new BroadcastingSignals(input, 2);
  expect(buttonSignalsTwice.finalCount).toEqual(48);
});

test("Day 20 puzzle a sample simple 2 - 3 pushes", () => {
  const input = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

  const buttonSignalsTwice = new BroadcastingSignals(input, 3);
  expect(buttonSignalsTwice.finalCount).toEqual(117); // 13 * 9
});

test("Day 20 puzzle a sample simple 2 - 4 pushes", () => {
  const input = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

  const buttonSignalsTwice = new BroadcastingSignals(input, 4);
  expect(buttonSignalsTwice.finalCount).toEqual(187); // 17 * 11
});

test("Day 20 puzzle a sample simple 1000 pushes", () => {
  const input = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

  const buttonSignals = new BroadcastingSignals(input, 1000);
  expect(buttonSignals.finalCount).toEqual(32000000);
});

test("Day 20 puzzle a sample simple 2 - 1000 pushes", () => {
  const input = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

  const buttonSignalsTwice = new BroadcastingSignals(input, 1000);
  expect(buttonSignalsTwice.finalCount).toEqual(11687500); // 17 * 11
});

test("Day 20 puzzle a input - 1000 pushes", () => {
  const input = `%qx -> gz
%tr -> rm
%qr -> kx, jm
%gj -> tx, rj
%lc -> hr
&kx -> zs, br, jd, bj, vg
&kd -> rg
%rm -> pf, ml
%tg -> tq, cp
%cp -> tp, tq
%sx -> qc, pf
&zf -> rg
%jz -> kx, pt
%dt -> tg, tq
%xv -> rj
%vz -> rj, xv
%vn -> vv, tq
%hl -> xt
%qc -> pf
%br -> jz
broadcaster -> sr, cg, dt, zs
%sk -> kx, qr
%xq -> dj
&vg -> rg
%zd -> pf, lc
%hr -> pm
%cg -> qx, rj
%tx -> vz, rj
%qf -> sb
&rj -> gs, sb, qx, qf, gz, hl, cg
%rb -> lz
%ml -> pf, xq
%bj -> jd
&gs -> rg
%sr -> pf, zd
%sb -> gj
&tq -> tp, rb, dt, kd, zt
%tp -> dm
%vv -> tq
%pm -> tr
%dj -> pf, sx
%lz -> vn, tq
%jd -> lx
%qn -> tq, rb
%zs -> kx, bj
&rg -> rx
%pt -> cb, kx
%xt -> ns, rj
%gz -> hl
%zt -> qn
%jm -> kx
%vp -> br, kx
&pf -> tr, hr, zf, sr, xq, pm, lc
%gp -> tq, zt
%dm -> tq, gp
%lx -> kx, vp
%ns -> qf, rj
%cb -> sk, kx`;

  const buttonSignalsTwice = new BroadcastingSignals(input, 1000);
  expect(buttonSignalsTwice.finalCount).toEqual(808146535);
});