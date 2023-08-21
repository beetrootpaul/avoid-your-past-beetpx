import { BeetPx, Vector2d, transparent_ } from "@beetpx/beetpx";
import { type CollisionCircle } from "../Collisions";
import { g, p8c } from "../globals";
import { AnimatedSprite } from "./AnimatedSprite";

type ItemParams = {
  tile: Vector2d;
  collisionCircleR: number;
  animatedSprite: AnimatedSprite;
};

export class Item {
  readonly #tile: Vector2d;
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
    const prevMapping = BeetPx.mapSpriteColors([
      { from: p8c.darkBlue, to: transparent_ },
    ]);

    BeetPx.sprite(
      this.#animatedSprite.currentSprite(),
      this.#tile.sub(1).mul(g.tileSize)
    );

    BeetPx.mapSpriteColors(prevMapping);

    if (BeetPx.debug) {
      const cc = this.collisionCircle();
      BeetPx.ellipse(cc.center.sub(cc.r), cc.center.add(cc.r), p8c.red);
    }
  }
}
