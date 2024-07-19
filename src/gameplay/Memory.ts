import {
  $,
  $d,
  $rgb_p8,
  $v,
  BpxDrawingPattern,
  BpxSprite,
  BpxSpriteColorMapping,
  BpxVector2d,
} from "@beetpx/beetpx";
import { CollisionCircle } from "../Collisions";
import { g } from "../globals";
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
    u: $v(7, 3).mul(g.spriteSheetCellSize),
    r: $v(8, 3).mul(g.spriteSheetCellSize),
    d: $v(9, 3).mul(g.spriteSheetCellSize),
    l: $v(10, 3).mul(g.spriteSheetCellSize),
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
      opts.noMemoriesModeFramesLeft > 0 ?
        $d.setSpriteColorMapping(
          BpxSpriteColorMapping.from([
            [$rgb_p8.storm, null],
            [$rgb_p8.ember, $rgb_p8.slate],
            [$rgb_p8.black, $rgb_p8.slate],
            [$rgb_p8.pink, $rgb_p8.silver],
            [$rgb_p8.tan, $rgb_p8.silver],
            [$rgb_p8.wine, $rgb_p8.silver],
          ]),
        )
      : $d.setSpriteColorMapping(
          BpxSpriteColorMapping.from([[$rgb_p8.storm, null]]),
        );

    if (opts.noMemoriesModeFramesLeft > 0) {
      $d.setDrawingPattern(
        this.#indicatorFillPattern(opts.noMemoriesModeFramesLeft),
      );
      this.#drawAboutToAppearIndicator();
      $d.setDrawingPattern(BpxDrawingPattern.primaryOnly);
    } else if (this.isActive()) {
      this.#drawMemory();
    } else if (this.isAboutToBecomeActive()) {
      if ((this.#originStateDelay - this.#originStateBuffer.length) % 8 < 4) {
        this.#drawAboutToAppearIndicator();
      }
    }

    $d.setSpriteColorMapping(prevMapping);

    if ($.debug) {
      const cc = this.collisionCircle();
      $d.ellipse(
        cc.center.sub(cc.r),
        $v(cc.r, cc.r).mul(2),
        this.isActive() ? $rgb_p8.ember : $rgb_p8.slate,
      );
    }
  }

  #drawMemory(): void {
    const spriteXy1 = this.#spriteXy1ForDirection[this.#direction];
    $d.sprite(
      BpxSprite.from(
        g.assets.spritesheet,
        g.spriteSheetCellSize.x,
        g.spriteSheetCellSize.y,
        spriteXy1.x,
        spriteXy1.y,
      ),
      this.#xy.sub(this.#r),
    );
  }

  #drawAboutToAppearIndicator(): void {
    const spriteXy1 = this.#spriteXy1ForDirection[this.#direction];
    $d.sprite(
      BpxSprite.from(
        g.assets.spritesheet,
        g.spriteSheetCellSize.x,
        g.spriteSheetCellSize.y,
        spriteXy1.x,
        spriteXy1.y,
      ),
      this.#xy.sub(this.#r),
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
