import { b_, BpxVector2d, transparent_, v_ } from "@beetpx/beetpx";
import { type CollisionCircle } from "../Collisions";
import { c, g } from "../globals";
import { AnimatedSprite } from "./AnimatedSprite";

type ItemParams = {
  tile: BpxVector2d;
  collisionCircleR: number;
  animatedSprite: AnimatedSprite;
};

export class Item {
  readonly #tile: BpxVector2d;
  readonly #collisionCircleR: number;
  readonly #animatedSprite: AnimatedSprite;

  constructor(params: ItemParams) {
    this.#tile = params.tile;
    this.#collisionCircleR = params.collisionCircleR;
    this.#animatedSprite = params.animatedSprite;
  }

  collisionCircle(): CollisionCircle {
    return {
      center: this.#tile.sub(1).mul(g.tileSize).add(g.tileSize.div(2)).sub(0.5),
      r: this.#collisionCircleR,
    };
  }

  animate(): void {
    this.#animatedSprite.advance1Frame();
  }

  draw(): void {
    const prevMapping = b_.mapSpriteColors([
      { from: c.darkBlue, to: transparent_ },
    ]);

    b_.sprite(
      this.#animatedSprite.currentSprite(),
      this.#tile.sub(1).mul(g.tileSize)
    );

    b_.mapSpriteColors(prevMapping);

    if (b_.debug) {
      const cc = this.collisionCircle();
      b_.ellipse(cc.center.sub(cc.r), v_(cc.r, cc.r).mul(2), c.red);
    }
  }
}
