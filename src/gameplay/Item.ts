import {
  b_,
  BpxAnimatedSprite,
  BpxSpriteColorMapping,
  BpxVector2d,
  rgb_p8_,
  v_,
} from "@beetpx/beetpx";
import { CollisionCircle } from "../Collisions";
import { g } from "../globals";

type ItemParams = {
  tile: BpxVector2d;
  collisionCircleR: number;
  animatedSprite: BpxAnimatedSprite;
};

export class Item {
  readonly #tile: BpxVector2d;
  readonly #collisionCircleR: number;
  readonly #animatedSprite: BpxAnimatedSprite;

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

  draw(): void {
    const prevMapping = b_.setSpriteColorMapping(
      BpxSpriteColorMapping.from([[rgb_p8_.storm, null]])
    );

    b_.drawSprite(
      this.#animatedSprite.current,
      this.#tile.sub(1).mul(g.tileSize)
    );

    b_.setSpriteColorMapping(prevMapping);

    if (b_.debug) {
      const cc = this.collisionCircle();
      b_.drawEllipse(cc.center.sub(cc.r), v_(cc.r, cc.r).mul(2), rgb_p8_.ember);
    }
  }
}
