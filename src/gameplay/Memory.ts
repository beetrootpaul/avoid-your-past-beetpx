import { b_, BpxSprite, BpxVector2d, transparent_, v_ } from "@beetpx/beetpx";
import { CollisionCircle } from "../Collisions";
import { c, g } from "../globals";
import { Direction } from "./Direction";
import { Origin, OriginSnapshot } from "./Origin";

type MemoryParams = {
  origin: Origin;
};

export class Memory extends Origin {
  readonly #originStateDelay = 40;
  readonly #aboutToBeActiveFrames = 20;
  readonly #originStateBuffer: OriginSnapshot[] = [];
  #originStateBufferIndex: number = 0;

  readonly #origin: Origin;
  #xy: BpxVector2d;
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

  center(): BpxVector2d {
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

  isAboutToBecomeActive(): boolean {
    return (
      this.#originStateBuffer.length >
      this.#originStateDelay - this.#aboutToBeActiveFrames
    );
  }

  isActive(): boolean {
    return this.#originStateBuffer.length > this.#originStateDelay;
  }

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
    const prevMapping = b_.mapSpriteColors([
      { from: c.darkBlue, to: transparent_ },
    ]);

    if (this.isActive()) {
      this.#drawMemory();
    } else if (this.isAboutToBecomeActive()) {
      this.#drawAboutToAppearIndicator();
    }

    b_.mapSpriteColors(prevMapping);

    if (b_.debug) {
      const cc = this.collisionCircle();
      b_.ellipse(
        cc.center.sub(cc.r),
        v_(cc.r, cc.r).mul(2),
        this.isActive() ? c.red : c.darkGrey
      );
    }
  }

  #drawMemory(): void {
    const spriteXy1 = this.#spriteXy1ForDirection[this.#direction];
    b_.sprite(
      new BpxSprite(
        g.assets.spritesheet,
        spriteXy1,
        spriteXy1.add(g.spriteSheetCellSize)
      ),
      this.#xy.sub(this.#r)
    );
  }

  #drawAboutToAppearIndicator(): void {
    if ((this.#originStateDelay - this.#originStateBuffer.length) % 8 < 4) {
      const spriteXy1 = this.#spriteXy1ForDirection[this.#direction];
      b_.sprite(
        new BpxSprite(
          g.assets.spritesheet,
          spriteXy1,
          spriteXy1.add(g.spriteSheetCellSize)
        ),
        this.#xy.sub(this.#r)
      );
    }
  }
}
