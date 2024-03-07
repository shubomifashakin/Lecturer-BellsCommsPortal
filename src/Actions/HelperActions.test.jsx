import { assert, test } from "vitest";
import {
  SortArrayBasedOnCreatedAt,
  SortArrayBasedOnLetters,
} from "./HelperActions";

const arrDate = [
  { name: "el1", created_at: new Date("Tuesday Mar 05 2024") },
  { name: "el2", created_at: new Date("Wednesday Mar 06 2024") },
  { name: "el3", created_at: new Date("Monday Mar 04 2024") },
  { name: "el4", created_at: new Date("Thursday Mar 07 2024") },
];

const arr = [
  "Apples",
  "Oranges",
  "Dogs",
  "Zebras",
  "Lions",
  "Love",
  "Xylophone",
];

const arr2 = ["nine", "one", "four"];

test("arrays should be in alphabetical order", () => {
  assert.deepEqual(SortArrayBasedOnLetters(arr), [
    "Apples",
    "Dogs",
    "Lions",
    "Love",
    "Oranges",
    "Xylophone",
    "Zebras",
  ]);

  assert.deepEqual(SortArrayBasedOnLetters(arr2), ["four", "nine", "one"]);

  assert.deepEqual(SortArrayBasedOnLetters([]), []);
});

test("arrays should be ordered w time", () => {
  assert.deepEqual(SortArrayBasedOnCreatedAt(arrDate), [
    { name: "el3", created_at: new Date("Monday Mar 04 2024") },
    { name: "el1", created_at: new Date("Tuesday Mar 05 2024") },
    { name: "el2", created_at: new Date("Wednesday Mar 06 2024") },
    { name: "el4", created_at: new Date("Thursday Mar 07 2024") },
  ]);
});
