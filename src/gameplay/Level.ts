import {
  $,
  $d,
  $rgb_p8,
  $u,
  $v,
  $v_0_0,
  BpxAnimatedSprite,
  BpxVector2d,
} from "@beetpx/beetpx";
import { Collisions } from "../Collisions";
import { g } from "../globals";
import { Item } from "./Item";
import { Mode } from "./Mode";
import { Player } from "./Player";

type LevelParams = {
  mode: Mode;
  player: Player;
};

export class Level {
  readonly #mode: Mode;
  readonly #player: Player;

  #coin: Item | null = null;
  #dropletNoCoins: Item | null = null;
  #dropletNoMemories: Item | null = null;

  constructor(params: LevelParams) {
    this.#mode = params.mode;
    this.#player = params.player;
  }

  #getTilesCloseToPlayer(): Record<string, boolean> {
    const leftTopTile = this.#player.xy1().div(g.tileSize).floor().add(1);
    const rightBottomTile = this.#player.xy2().div(g.tileSize).floor().add(1);

    const closeTiles: Record<string, boolean> = {};
    const marginTiles = 3;
    for (
      let tileX = leftTopTile.x - marginTiles;
      tileX <= rightBottomTile.x + marginTiles;
      tileX += 1
    ) {
      for (
        let tileY = leftTopTile.y - marginTiles;
        tileY <= rightBottomTile.y + marginTiles;
        tileY += 1
      ) {
        closeTiles[`${tileX}_${tileY}`] = true;
      }
    }
    return closeTiles;
  }

  spawnItems(): void {
    const tilesCloseToPlayer = this.#getTilesCloseToPlayer();

    let availableTiles: BpxVector2d[] = [];

    const marginTiles = 1;
    for (
      let tileX = 1 + marginTiles;
      tileX <= g.gameAreaSize.div(g.tileSize).x - marginTiles;
      tileX += 1
    ) {
      for (
        let tileY = 1 + marginTiles;
        tileY <= g.gameAreaSize.div(g.tileSize).y - marginTiles;
        tileY += 1
      ) {
        if (!tilesCloseToPlayer[`${tileX}_${tileY}`]) {
          availableTiles.push($v(tileX, tileY));
        }
      }
    }

    if (availableTiles.length > 0) {
      const coinTile =
        availableTiles[Math.floor(Math.random() * availableTiles.length)];
      if (coinTile) {
        availableTiles = availableTiles.filter(tile => !tile.eq(coinTile));
        this.#coin = new Item({
          tile: coinTile,
          collisionCircleR: 2.5,
          animatedSprite: BpxAnimatedSprite.from(
            g.assets.spritesheet,
            g.spriteSheetCellSize.x,
            g.spriteSheetCellSize.y,
            $u.repeatEachElement(
              2,
              $u.range(16).map(i => [i * 8, 8]),
            ),
          ),
        });
      }
    }

    if (
      !this.#dropletNoCoins &&
      !this.#dropletNoMemories &&
      !this.#mode.isNoCoins() &&
      !this.#mode.isNoMemories()
    ) {
      const dropletTile = $u.randomElementOf(availableTiles);
      if (dropletTile) {
        const probability = Math.random();
        $.logDebug("Droplet probability:", probability);
        if (probability < 0.3) {
          this.#dropletNoCoins = new Item({
            tile: dropletTile,
            collisionCircleR: 3.5,
            animatedSprite: BpxAnimatedSprite.from(
              g.assets.spritesheet,
              g.spriteSheetCellSize.x,
              g.spriteSheetCellSize.y,
              [[0, 16]],
            ),
          });
        } else if (probability > 0.7) {
          this.#dropletNoMemories = new Item({
            tile: dropletTile,
            collisionCircleR: 3.5,
            animatedSprite: BpxAnimatedSprite.from(
              g.assets.spritesheet,
              g.spriteSheetCellSize.x,
              g.spriteSheetCellSize.y,
              [[0, 24]],
            ),
          });
        }
      }
    }
  }

  removeCoin(): void {
    this.#coin = null;
  }

  removeDropletNoCoins(): void {
    this.#dropletNoCoins = null;
  }

  removeDropletNoMemories(): void {
    this.#dropletNoMemories = null;
  }

  checkCollisions(callbacks: {
    onCoin: () => void;
    onDropletNoCoins: () => void;
    onDropletNoMemories: () => void;
  }): void {
    if (this.#coin) {
      if (
        Collisions.haveCirclesCollided(
          this.#player.collisionCircle(),
          this.#coin.collisionCircle(),
        )
      ) {
        callbacks.onCoin();
      }
    }

    if (this.#dropletNoCoins) {
      if (
        Collisions.haveCirclesCollided(
          this.#player.collisionCircle(),
          this.#dropletNoCoins.collisionCircle(),
        )
      ) {
        callbacks.onDropletNoCoins();
      }
    }
    if (this.#dropletNoMemories) {
      if (
        Collisions.haveCirclesCollided(
          this.#player.collisionCircle(),
          this.#dropletNoMemories.collisionCircle(),
        )
      ) {
        callbacks.onDropletNoMemories();
      }
    }
  }

  drawBg(): void {
    const prevPattern = $d.setDrawingPattern(this.#mode.bgPattern());
    $d.rectFilled($v_0_0, g.gameAreaSize, this.#mode.bgColor());
    $d.setDrawingPattern(prevPattern);

    if ($.debug) {
      const tilesCloseToPlayer = this.#getTilesCloseToPlayer();
      for (
        let tileX = 1;
        tileX <= g.gameAreaSize.div(g.tileSize).x;
        tileX += 1
      ) {
        for (
          let tileY = 1;
          tileY <= g.gameAreaSize.div(g.tileSize).y;
          tileY += 1
        ) {
          $d.pixel($v(tileX, tileY).sub(1).mul(g.tileSize), $rgb_p8.dusk);
          if (tilesCloseToPlayer[`${tileX}_${tileY}`]) {
            $d.rectFilled(
              $v(tileX - 1, tileY - 1)
                .mul(g.tileSize)
                .add(1),
              g.tileSize.sub(1),
              $rgb_p8.wine,
            );
          }
        }
      }
    }
  }

  drawItems(): void {
    if (!this.#mode.isNoCoins()) {
      this.#coin?.draw();
    }
    this.#dropletNoCoins?.draw();
    this.#dropletNoMemories?.draw();
  }
}
