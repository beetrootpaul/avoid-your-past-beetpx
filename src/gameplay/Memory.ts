import {
  b_,
  BpxDrawingPattern,
  BpxSprite,
  BpxSpriteColorMapping,
  BpxVector2d,
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
    const prevMapping =
      opts.noMemoriesModeFramesLeft > 0
        ? b_.setSpriteColorMapping(
            BpxSpriteColorMapping.from([
              [c.darkBlue, null],
              [c.red, c.darkGrey],
              [c.black, c.darkGrey],
              [c.pink, c.lightGrey],
              [c.brown, c.lightGrey],
              [c.darkPurple, c.lightGrey],
            ])
          )
        : b_.setSpriteColorMapping(
            BpxSpriteColorMapping.from([[c.darkBlue, null]])
          );

    if (opts.noMemoriesModeFramesLeft > 0) {
      b_.setDrawingPattern(
        this.#indicatorFillPattern(opts.noMemoriesModeFramesLeft)
      );
      this.#drawAboutToAppearIndicator();
      b_.setDrawingPattern(BpxDrawingPattern.primaryOnly);
    } else if (this.isActive()) {
      this.#drawMemory();
    } else if (this.isAboutToBecomeActive()) {
      if ((this.#originStateDelay - this.#originStateBuffer.length) % 8 < 4) {
        this.#drawAboutToAppearIndicator();
      }
    }

    b_.setSpriteColorMapping(prevMapping);

    if (b_.debug) {
      const cc = this.collisionCircle();
      b_.drawEllipse(
        cc.center.sub(cc.r),
        v_(cc.r, cc.r).mul(2),
        this.isActive() ? c.red : c.darkGrey
      );
    }
  }

  #drawMemory(): void {
    const spriteXy1 = this.#spriteXy1ForDirection[this.#direction];
    b_.drawSprite(
      BpxSprite.from(
        g.assets.spritesheet,
        g.spriteSheetCellSize.x,
        g.spriteSheetCellSize.y,
        spriteXy1.x,
        spriteXy1.y
      ),
      this.#xy.sub(this.#r)
    );
  }

  #drawAboutToAppearIndicator(): void {
    const spriteXy1 = this.#spriteXy1ForDirection[this.#direction];
    b_.drawSprite(
      BpxSprite.from(
        g.assets.spritesheet,
        g.spriteSheetCellSize.x,
        g.spriteSheetCellSize.y,
        spriteXy1.x,
        spriteXy1.y
      ),
      this.#xy.sub(this.#r)
    );
  }

  #indicatorFillPattern(framesLeft: number): BpxDrawingPattern {
    const base = 20;
    if (framesLeft < base) {
      return BpxDrawingPattern.primaryOnly;
    }
    if (framesLeft < base + 4) {
      return BpxDrawingPattern.from(`
        ####
        ####
        ####
        ###-
      `);
    }
    if (framesLeft < base + 8) {
      return BpxDrawingPattern.from(`
        ####
        #-#-
        ####
        #-#-
      `);
    }
    if (framesLeft < base + 12) {
      return BpxDrawingPattern.from(`
        -#-#
        #-#-
        -#-#
        #-#-
      `);
    }
    if (framesLeft < base + 16) {
      return BpxDrawingPattern.from(`
        -#-#
        ----
        -#-#
        ----
      `);
    }
    if (framesLeft < base + 20) {
      return BpxDrawingPattern.from(`
        ----
        ----
        -#--
        ----
      `);
    }
    return BpxDrawingPattern.secondaryOnly;
  }
}
