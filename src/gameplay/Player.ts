import { BeetPx, Sprite, Vector2d, transparent_, v_ } from "@beetpx/beetpx";
import { type CollisionCircle } from "../Collisions";
import { g, p8c } from "../globals";
import { Direction } from "./Direction";
import { Origin } from "./Origin";

export class Player extends Origin {
  readonly #r = 3;
  readonly #speed = 2;

  #xy: Vector2d = g.gameAreaSize.div(2);

  // Let's start right (but it's effectively unused, because we
  //   let the user to choose the direction at the game's start).
  #direction: Direction = "r";
  #dXy = v_(this.#speed, 0);

  readonly #spriteXy1ForDirection = {
    u: v_(7, 2).mul(g.spriteSheetCellSize),
    r: v_(8, 2).mul(g.spriteSheetCellSize),
    d: v_(9, 2).mul(g.spriteSheetCellSize),
    l: v_(10, 2).mul(g.spriteSheetCellSize),
  };

  center(): Vector2d {
    return this.#xy;
  }

  r(): number {
    return this.#r;
  }

  direction(): Direction {
    return this.#direction;
  }

  xy1(): Vector2d {
    return this.#xy.sub(this.#r);
  }

  xy2(): Vector2d {
    return this.#xy.add(this.#r);
  }

  collisionCircle(): CollisionCircle {
    return {
      center: this.#xy,
      r: this.#r,
    };
  }

  direct(direction: Direction): void {
    this.#dXy = v_(
      direction === "l" ? -this.#speed : direction === "r" ? this.#speed : 0,
      direction === "u" ? -this.#speed : direction === "d" ? this.#speed : 0
    );
    this.#direction = direction;
  }

  move(): void {
    this.#xy = this.#xy.add(this.#dXy);
    this.#xy = this.#xy.clamp(
      v_(this.#r, this.#r),
      g.gameAreaSize.sub(this.#r + 1)
    );
  }

  draw(): void {
    const prevMapping = BeetPx.mapSpriteColors([
      { from: p8c.darkBlue, to: transparent_ },
    ]);

    const spriteXy1 = this.#spriteXy1ForDirection[this.#direction];
    BeetPx.sprite(
      new Sprite(
        g.assets.spritesheet,
        spriteXy1,
        spriteXy1.add(g.spriteSheetCellSize)
      ),
      this.#xy.sub(this.#r)
    );

    BeetPx.mapSpriteColors(prevMapping);

    if (BeetPx.debug) {
      const cc = this.collisionCircle();
      BeetPx.ellipse(cc.center.sub(cc.r), cc.center.add(cc.r), p8c.red);
    }
  }
}
