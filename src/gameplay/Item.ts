import {
  $,
  $d,
  $rgb_p8,
  $v,
  BpxAnimatedSprite,
  BpxSpriteColorMapping,
  BpxVector2d,
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
    const prevMapping = $d.setSpriteColorMapping(
      BpxSpriteColorMapping.from([[$rgb_p8.storm, null]]),
    );

    $d.sprite(this.#animatedSprite.current, this.#tile.sub(1).mul(g.tileSize));

    $d.setSpriteColorMapping(prevMapping);

    if ($.debug) {
      const cc = this.collisionCircle();
      $d.ellipse(cc.center.sub(cc.r), $v(cc.r, cc.r).mul(2), $rgb_p8.ember);
    }
  }
}
