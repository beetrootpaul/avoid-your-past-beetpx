import { Vector2d } from "@beetpx/beetpx";
import { Direction } from "./Direction";

export abstract class Origin {
  abstract center(): Vector2d;

  abstract r(): number;

  abstract direction(): Direction;

  snapshot(): OriginSnapshot {
    return {
      center: this.center(),
      r: this.r(),
      direction: this.direction(),
    };
  }
}

export type OriginSnapshot = {
  center: Vector2d;
  r: number;
  direction: Direction;
};
