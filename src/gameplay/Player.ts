import { Sprite, transparent, Xy, xy_ } from "beetpx";
import { type CollisionCircle } from "../Collisions";
import { f, g, p8c } from "../globals";
import { Direction } from "./Direction";
import { Origin } from "./Origin";

export class Player extends Origin {
  readonly #r = 3;
  readonly #speed = 2;

  #xy: Xy = g.gameAreaSize.div(2);

  // Let's start right (but it's effectively unused, because we
  //   let the user to choose the direction at the game's start).
  #direction: Direction = "r";
  #dXy = xy_(this.#speed, 0);

  readonly #spriteXy1ForDirection = {
    u: xy_(7, 2).mul(g.spriteSheetCellSize),
    r: xy_(8, 2).mul(g.spriteSheetCellSize),
    d: xy_(9, 2).mul(g.spriteSheetCellSize),
    l: xy_(10, 2).mul(g.spriteSheetCellSize),
  };

  center(): Xy {
    return this.#xy;
  }

  r(): number {
    return this.#r;
  }

  direction(): Direction {
    return this.#direction;
  }

  xy1(): Xy {
    return this.#xy.sub(this.#r);
  }

  xy2(): Xy {
    return this.#xy.add(this.#r);
  }

  collisionCircle(): CollisionCircle {
    return {
      center: this.#xy,
      r: this.#r,
    };
  }

  // TODO: replace all these 4 methods with a single one which takes Direction as a param
  directLeft(): void {
    this.#dXy = xy_(-this.#speed, 0);
    this.#direction = "l";
  }

  directRight(): void {
    this.#dXy = xy_(this.#speed, 0);
    this.#direction = "r";
  }

  directUp(): void {
    this.#dXy = xy_(0, -this.#speed);
    this.#direction = "u";
  }

  directDown(): void {
    this.#dXy = xy_(0, this.#speed);
    this.#direction = "d";
  }

  move(): void {
    this.#xy = this.#xy.add(this.#dXy);
    this.#xy = this.#xy.clamp(
      xy_(this.#r, this.#r),
      g.gameAreaSize.sub(this.#r + 1)
    );
  }

  draw(): void {
    f.drawApi.mapSpriteColor(p8c.darkBlue, transparent);

    const spriteXy1 = this.#spriteXy1ForDirection[this.#direction];
    f.drawApi.sprite(
      g.assets.spritesheet,
      new Sprite(spriteXy1, spriteXy1.add(g.spriteSheetCellSize)),
      this.#xy.sub(this.#r)
    );

    // TODO: API to reset all mappings?
    f.drawApi.mapSpriteColor(p8c.darkBlue, p8c.darkBlue);

    if (f.debug) {
      const cc = this.collisionCircle();
      f.drawApi.ellipse(cc.center.sub(cc.r), cc.center.add(cc.r), p8c.red);
    }
  }
}
