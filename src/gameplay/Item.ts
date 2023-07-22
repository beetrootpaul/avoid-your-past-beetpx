import { transparent, Xy } from "beetpx";
import { type CollisionCircle } from "../Collisions";
import { f, g, p8c } from "../globals";
import { AnimatedSprite } from "./AnimatedSprite";

type ItemParams = {
  tile: Xy;
  collisionCircleR: number;
  animatedSprite: AnimatedSprite;
};

export class Item {
  readonly #tile: Xy;
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
    f.drawApi.mapSpriteColor(p8c.darkBlue, transparent);

    f.drawApi.sprite(
      g.assets.spritesheet,
      this.#animatedSprite.currentSprite(),
      this.#tile.sub(1).mul(g.tileSize)
    );

    // TODO: API to reset all mappings?
    f.drawApi.mapSpriteColor(p8c.darkBlue, p8c.darkBlue);

    if (f.debug) {
      const cc = this.collisionCircle();
      f.drawApi.ellipse(cc.center.sub(cc.r), cc.center.add(cc.r), p8c.red);
    }
  }
}
