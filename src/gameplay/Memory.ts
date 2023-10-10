import {
  b_,
  BpxFillPattern,
  BpxSprite,
  BpxVector2d,
  transparent_,
  v_,
} from "@beetpx/beetpx";
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

  draw(opts: { noMemoriesModeFramesLeft: number }): void {
    const prevMapping = b_.mapSpriteColors([
      { from: c.darkBlue, to: transparent_ },
      ...(opts.noMemoriesModeFramesLeft > 0
        ? [
            { from: c.red, to: c.darkGrey },
            { from: c.black, to: c.darkGrey },
            { from: c.pink, to: c.lightGrey },
            { from: c.brown, to: c.lightGrey },
            { from: c.darkPurple, to: c.lightGrey },
          ]
        : []),
    ]);

    if (opts.noMemoriesModeFramesLeft > 0) {
      b_.setFillPattern(
        this.#indicatorFillPattern(opts.noMemoriesModeFramesLeft)
      );
      this.#drawAboutToAppearIndicator();
      b_.setFillPattern(BpxFillPattern.primaryOnly);
    } else if (this.isActive()) {
      this.#drawMemory();
    } else if (this.isAboutToBecomeActive()) {
      if ((this.#originStateDelay - this.#originStateBuffer.length) % 8 < 4) {
        this.#drawAboutToAppearIndicator();
      }
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

  #indicatorFillPattern(framesLeft: number): BpxFillPattern {
    const base = 20;
    if (framesLeft < base) {
      return BpxFillPattern.primaryOnly;
    }
    if (framesLeft < base + 4) {
      return BpxFillPattern.of(0b0000_0000_0000_0001);
    }
    if (framesLeft < base + 8) {
      return BpxFillPattern.of(0b0000_0101_0000_0101);
    }
    if (framesLeft < base + 12) {
      return BpxFillPattern.of(0b1010_0101_1010_0101);
    }
    if (framesLeft < base + 16) {
      return BpxFillPattern.of(0b1010_1111_1010_1111);
    }
    if (framesLeft < base + 20) {
      return BpxFillPattern.of(0b1111_1111_1011_1111);
    }
    return BpxFillPattern.secondaryOnly;
  }
}
