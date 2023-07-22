import { describe, expect, test } from "@jest/globals";
import { v_ } from "beetpx";
import { Collisions } from "./Collisions";

describe("Collisions", () => {
  // TODO: more test cases
  test("#haveCirclesCollided", () => {
    expect(
      Collisions.haveCirclesCollided(
        { center: v_(0, 0), r: 50 },
        { center: v_(100, 100), r: 50 }
      )
    ).toEqual(false);
    expect(
      Collisions.haveCirclesCollided(
        { center: v_(25, 25), r: 100 },
        { center: v_(75, 75), r: 100 }
      )
    ).toEqual(true);
  });
});
