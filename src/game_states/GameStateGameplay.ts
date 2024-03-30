import { b_ } from "@beetpx/beetpx";
import { Game } from "../Game";
import { Direction } from "../gameplay/Direction";
import { Level } from "../gameplay/Level";
import { Memories } from "../gameplay/Memories";
import { Mode } from "../gameplay/Mode";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { Trail } from "../gameplay/Trail";
import { c, g } from "../globals";
import { Topbar } from "../gui/Topbar";
import { GameState } from "./GameState";
import { GameStateOver } from "./GameStateOver";

type GameStateGameplayParams = {
  mode: Mode;
  topbar: Topbar;
  score: Score;
  level: Level;
  player: Player;
};

export class GameStateGameplay implements GameState {
  readonly #mode: Mode;
  readonly #topbar: Topbar;
  readonly #score: Score;
  readonly #level: Level;
  readonly #player: Player;
  readonly #memories: Memories;
  readonly #playerTrail: Trail;

  constructor(params: GameStateGameplayParams) {
    this.#mode = params.mode;
    this.#topbar = params.topbar;
    this.#score = params.score;
    this.#level = params.level;
    this.#player = params.player;
    this.#memories = new Memories({
      player: this.#player,
    });
    this.#playerTrail = new Trail({
      origin: this.#player,
      color: c.darkGreen,
    });

    b_.unmutePlayback(Game.playbackIds.melody);
  }

  #onBackToRegularMode(): void {
    b_.mutePlayback(Game.playbackIds.modeNoCoins);
    b_.mutePlayback(Game.playbackIds.modeNoMemories);
  }

  #onCoinCollision(): void {
    if (this.#mode.isNoCoins()) {
      return;
    }

    b_.startPlayback(g.assets.coinSfx);

    this.#score.add(10);

    if (!this.#mode.isNoMemories()) {
      this.#memories.addMemory();
    }
    this.#level.removeCoin();
    this.#level.spawnItems();
  }

  #onDropletNoCoinsCollision(): void {
    b_.unmutePlayback(Game.playbackIds.modeNoCoins);
    this.#score.add(3);
    this.#mode.startNoCoins();
    this.#level.removeDropletNoCoins();
  }

  #onDropletNoMemoriesCollision(): void {
    b_.unmutePlayback(Game.playbackIds.modeNoMemories);
    this.#score.add(1);
    this.#mode.startNoMemories();
    this.#level.removeDropletNoMemories();
  }

  update(): GameState {
    const detectedDirections: Direction[] = [];
    if (b_.wasButtonJustPressed("left")) detectedDirections.push("l");
    if (b_.wasButtonJustPressed("right")) detectedDirections.push("r");
    if (b_.wasButtonJustPressed("up")) detectedDirections.push("u");
    if (b_.wasButtonJustPressed("down")) detectedDirections.push("d");
    if (detectedDirections.length === 1) {
      detectedDirections.forEach(this.#player.direct.bind(this.#player));
    }

    this.#mode.update({
      onBackToRegularMode: this.#onBackToRegularMode.bind(this),
    });

    this.#level.checkCollisions({
      onCoin: this.#onCoinCollision.bind(this),
      onDropletNoCoins: this.#onDropletNoCoinsCollision.bind(this),
      onDropletNoMemories: this.#onDropletNoMemoriesCollision.bind(this),
    });

    this.#playerTrail.update();
    this.#player.move();

    this.#memories.move();

    if (!this.#mode.isNoMemories()) {
      if (this.#memories.hasPlayerCollidedWithMemory()) {
        return new GameStateOver({
          score: this.#score,
          level: this.#level,
          player: this.#player,
        });
      }
    }

    return this;
  }

  draw(): void {
    this.#level.drawBg();

    this.#level.drawItems();

    this.#playerTrail.draw();

    this.#memories.draw({
      noMemoriesModeFramesLeft: this.#mode.noMemoriesModeFramesLeft(),
    });

    this.#player.draw();

    this.#topbar.draw();
  }
}
