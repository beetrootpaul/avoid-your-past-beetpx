import { b_, BpxVector2d, u_, v_, v_0_0_ } from "@beetpx/beetpx";
import { Collisions } from "../Collisions";
import { c, g } from "../globals";
import { AnimatedSprite } from "./AnimatedSprite";
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
          availableTiles.push(v_(tileX, tileY));
        }
      }
    }

    if (availableTiles.length > 0) {
      const coinTile =
        availableTiles[Math.floor(Math.random() * availableTiles.length)];
      if (coinTile) {
        availableTiles = availableTiles.filter((tile) => !tile.eq(coinTile));
        this.#coin = new Item({
          tile: coinTile,
          collisionCircleR: 2.5,
          animatedSprite: new AnimatedSprite({
            firstSpriteSheetCell: 16,
            numberOfSprites: 16,
            framesPerSprite: (2 * g.musicBeatFrames) / 16,
          }),
        });
      }
    }

    if (
      !this.#dropletNoCoins &&
      !this.#dropletNoMemories &&
      !this.#mode.isNoCoins() &&
      !this.#mode.isNoMemories()
    ) {
      const dropletTile = u_.randomElementOf(availableTiles);
      if (dropletTile) {
        const probability = Math.random();
        b_.logDebug("Droplet probability:", probability);
        if (probability < 0.3) {
          this.#dropletNoCoins = new Item({
            tile: dropletTile,
            collisionCircleR: 3.5,
            animatedSprite: new AnimatedSprite({
              firstSpriteSheetCell: 32,
              numberOfSprites: 1,
              framesPerSprite: 1,
            }),
          });
        } else if (probability > 0.7) {
          this.#dropletNoMemories = new Item({
            tile: dropletTile,
            collisionCircleR: 3.5,
            animatedSprite: new AnimatedSprite({
              firstSpriteSheetCell: 48,
              numberOfSprites: 1,
              framesPerSprite: 1,
            }),
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
          this.#coin.collisionCircle()
        )
      ) {
        callbacks.onCoin();
      }
    }

    if (this.#dropletNoCoins) {
      if (
        Collisions.haveCirclesCollided(
          this.#player.collisionCircle(),
          this.#dropletNoCoins.collisionCircle()
        )
      ) {
        callbacks.onDropletNoCoins();
      }
    }
    if (this.#dropletNoMemories) {
      if (
        Collisions.haveCirclesCollided(
          this.#player.collisionCircle(),
          this.#dropletNoMemories.collisionCircle()
        )
      ) {
        callbacks.onDropletNoMemories();
      }
    }
  }

  animate(): void {
    this.#coin?.animate();
    this.#dropletNoCoins?.animate();
    this.#dropletNoMemories?.animate();
  }

  drawBg(): void {
    const prevPattern = b_.setPattern(this.#mode.bgPattern());
    b_.rectFilled(v_0_0_, g.gameAreaSize, this.#mode.bgColor());
    b_.setPattern(prevPattern);

    if (b_.debug) {
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
          b_.pixel(v_(tileX, tileY).sub(1).mul(g.tileSize), c.lavender);
          if (tilesCloseToPlayer[`${tileX}_${tileY}`]) {
            b_.rectFilled(
              v_(tileX - 1, tileY - 1)
                .mul(g.tileSize)
                .add(1),
              g.tileSize.sub(1),
              c.darkPurple
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
