import { FillPattern, Xy, xy_ } from "beetpx";
import { Collisions } from "../Collisions";
import { f, g, p8c } from "../globals";
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

    let availableTiles: Xy[] = [];

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
          availableTiles.push(xy_(tileX, tileY));
        }
      }
    }

    if (availableTiles.length > 0) {
      // TODO: create an util for random array pick + cover it with tests
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
            framesPerSprite: 2,
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
      // TODO: create an util for random array pick + cover it with tests
      const dropletTile =
        availableTiles[Math.floor(Math.random() * availableTiles.length)];
      if (dropletTile) {
        const probability = Math.random();
        if (f.debug) {
          // TODO: use some custom logger?
          console.debug("Droplet probability:", probability);
        }
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
    f.drawApi.setFillPattern(this.#mode.bgPattern());
    f.drawApi.rectFilled(Xy.zero, g.gameAreaSize, this.#mode.bgColor());
    f.drawApi.setFillPattern(FillPattern.primaryOnly);

    if (f.debug) {
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
          f.drawApi.pixel(
            xy_(tileX, tileY).sub(1).mul(g.tileSize),
            p8c.lavender
          );
          if (tilesCloseToPlayer[`${tileX}_${tileY}`]) {
            f.drawApi.rectFilled(
              xy_(tileX - 1, tileY - 1)
                .mul(g.tileSize)
                .add(1),
              xy_(tileX, tileY).mul(g.tileSize),
              p8c.darkPurple
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
