import {
  $,
  $d,
  $rgb_p8,
  $v,
  BpxSprite,
  BpxSpriteColorMapping,
  BpxVector2d,
} from "@beetpx/beetpx";
import { type CollisionCircle } from "../Collisions";
import { g } from "../globals";
import { Direction } from "./Direction";
import { Origin } from "./Origin";

export class Player extends Origin {
  readonly #r = 3;
  readonly #speed = 2;

  #xy: BpxVector2d = g.gameAreaSize.div(2);

  // Let's start right (but it's effectively unused, because we
  //   let the user to choose the direction at the game's start).
  #direction: Direction = "r";
  #dXy = $v(this.#speed, 0);

  readonly #spriteXy1ForDirection = {
    u: $v(7, 2).mul(g.spriteSheetCellSize),
    r: $v(8, 2).mul(g.spriteSheetCellSize),
    d: $v(9, 2).mul(g.spriteSheetCellSize),
    l: $v(10, 2).mul(g.spriteSheetCellSize),
  };

  center(): BpxVector2d {
    return this.#xy;
  }

  r(): number {
    return this.#r;
  }

  direction(): Direction {
    return this.#direction;
  }

  isActive(): boolean {
    return true;
  }

  xy1(): BpxVector2d {
    return this.#xy.sub(this.#r);
  }

  xy2(): BpxVector2d {
    return this.#xy.add(this.#r);
  }

  collisionCircle(): CollisionCircle {
    return {
      center: this.#xy,
      r: this.#r,
    };
  }

  direct(direction: Direction): void {
    this.#dXy = $v(
      direction === "l" ? -this.#speed
      : direction === "r" ? this.#speed
      : 0,
      direction === "u" ? -this.#speed
      : direction === "d" ? this.#speed
      : 0,
    );
    this.#direction = direction;
  }

  move(): void {
    this.#xy = this.#xy.add(this.#dXy);
    this.#xy = this.#xy.clamp(
      $v(this.#r, this.#r),
      g.gameAreaSize.sub(this.#r + 1),
    );
  }

  draw(): void {
    const prevMapping = $d.setSpriteColorMapping(
      BpxSpriteColorMapping.from([[$rgb_p8.storm, null]]),
    );

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

    $d.setSpriteColorMapping(prevMapping);

    if ($.debug) {
      const cc = this.collisionCircle();
      $d.ellipse(cc.center.sub(cc.r), $v(cc.r, cc.r).mul(2), $rgb_p8.ember);
    }
  }
}
