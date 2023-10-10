import { BpxVector2d } from "@beetpx/beetpx";
import { Direction } from "./Direction";

export abstract class Origin {
  abstract center(): BpxVector2d;

  abstract r(): number;

  abstract direction(): Direction;

  abstract isActive(): boolean;

  snapshot(): OriginSnapshot {
    return {
      center: this.center(),
      r: this.r(),
      direction: this.direction(),
    };
  }
}

export type OriginSnapshot = {
  center: BpxVector2d;
  r: number;
  direction: Direction;
};
