import { BeetPx, Sprite, Vector2d, transparent_, v_ } from "@beetpx/beetpx";
import { CollisionCircle } from "../Collisions";
import { g, p8c } from "../globals";
import { Direction } from "./Direction";
import { Origin, OriginSnapshot } from "./Origin";

type MemoryParams = {
  origin: Origin;
};

export class Memory extends Origin {
  readonly #originStateDelay = 40;
  readonly #originStateBuffer: OriginSnapshot[] = [];
  #originStateBufferIndex: number = 0;

  readonly #origin: Origin;
  #xy: Vector2d;
  #r: number;
  #direction: Direction;

  readonly #spriteXy1ForDirection = {
    u: v_(7, 3).mul(g.spriteSheetCellSize),
    r: v_(8, 3).mul(g.spriteSheetCellSize),
    d: v_(9, 3).mul(g.spriteSheetCellSize),
    l: v_(10, 3).mul(g.spriteSheetCellSize),
  };

  constructor(params: MemoryParams) {
    super();
    this.#origin = params.origin;
    this.#xy = this.#origin.center();
    this.#r = this.#origin.r();
    this.#direction = this.#origin.direction();
  }

  center(): Vector2d {
    return this.#xy;
  }

  r(): number {
    return this.#r;
  }

  direction(): Direction {
    return this.#direction;
  }

  collisionCircle(): CollisionCircle {
    return {
      center: this.#xy,
      r: this.#r,
    };
  }

  isActive(): boolean {
    return this.#originStateBuffer.length > this.#originStateDelay;
  }

  // TODO: cover the ring-moving index logic with tests
  followOrigin(): void {
    this.#originStateBuffer[this.#originStateBufferIndex] =
      this.#origin.snapshot();

    const bufferSize = this.#originStateDelay + 1;
    const delayedStateIndex = (this.#originStateBufferIndex + 1) % bufferSize;
    const delayedState = this.#originStateBuffer[delayedStateIndex];
    if (delayedState) {
      this.#xy = delayedState.center;
      this.#r = delayedState.r;
      this.#direction = delayedState.direction;
    }

    this.#originStateBufferIndex =
      (this.#originStateBufferIndex + 1) % bufferSize;
  }

  draw(): void {
    BeetPx.mapSpriteColor(p8c.darkBlue, transparent_);

    if (this.isActive()) {
      const spriteXy1 = this.#spriteXy1ForDirection[this.#direction];
      BeetPx.sprite(
        g.assets.spritesheet,
        new Sprite(spriteXy1, spriteXy1.add(g.spriteSheetCellSize)),
        this.#xy.sub(this.#r)
      );
    }

    // TODO: API to reset all mappings?
    BeetPx.mapSpriteColor(p8c.darkBlue, p8c.darkBlue);

    if (BeetPx.debug) {
      const cc = this.collisionCircle();
      BeetPx.ellipse(
        cc.center.sub(cc.r),
        cc.center.add(cc.r),
        this.isActive() ? p8c.red : p8c.darkGrey
      );
    }
  }
}
