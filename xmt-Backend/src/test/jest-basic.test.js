import { add } from "../service/something";

test("add(2,3) equel 5 ?", () => {
  expect(add(2, 3)).toBe(5);
});

test("add(0,5) equel 5 ?", () => {
  expect(add(0, 5)).toBe(5);
});

test("add(-2,2) equel 0 ?", () => {
  expect(add(-2, 2)).toBe(0);
});

test("add(0,2) equel 2 ?", () => {
  expect(add(0, 2)).toBe(2);
});
