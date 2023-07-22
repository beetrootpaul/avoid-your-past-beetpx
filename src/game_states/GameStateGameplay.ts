import { Level } from "../gameplay/Level";
import { Memories } from "../gameplay/Memories";
import { Mode } from "../gameplay/Mode";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { Trail } from "../gameplay/Trail";
import { f, g, p8c } from "../globals";
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
      color: p8c.darkGreen,
    });

    f.audio.unmuteSound(g.assets.musicMelody);
  }

  #onBackToRegularMode(): void {
    f.audio.muteSound(g.assets.musicModeNoCoins);
    f.audio.muteSound(g.assets.musicModeNoMemories);
  }

  #onCoinCollision(): void {
    if (this.#mode.isNoCoins()) {
      return;
    }

    f.audio.playSoundOnce(g.assets.coinSfx);

    this.#score.add(10);

    if (!this.#mode.isNoMemories()) {
      this.#memories.addMemory();
    }
    this.#level.removeCoin();
    this.#level.spawnItems();
  }

  #onDropletNoCoinsCollision(): void {
    f.audio.unmuteSound(g.assets.musicModeNoCoins);
    this.#score.add(3);
    this.#mode.startNoCoins();
    this.#level.removeDropletNoCoins();
  }

  #onDropletNoMemoriesCollision(): void {
    f.audio.unmuteSound(g.assets.musicModeNoMemories);
    this.#score.add(1);
    this.#mode.startNoMemories();
    this.#level.removeDropletNoMemories();
  }

  update(): GameState {
    if (f.continuousInputEvents.has("left")) {
      this.#player.directLeft();
    } else if (f.continuousInputEvents.has("right")) {
      this.#player.directRight();
    } else if (f.continuousInputEvents.has("up")) {
      this.#player.directUp();
    } else if (f.continuousInputEvents.has("down")) {
      this.#player.directDown();
    }

    this.#mode.update({
      onBackToRegularMode: this.#onBackToRegularMode.bind(this),
    });

    this.#level.checkCollisions({
      onCoin: this.#onCoinCollision.bind(this),
      onDropletNoCoins: this.#onDropletNoCoinsCollision.bind(this),
      onDropletNoMemories: this.#onDropletNoMemoriesCollision.bind(this),
    });

    this.#level.animate();

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
    this.#player.draw();

    if (!this.#mode.isNoMemories()) {
      this.#memories.draw();
    }

    this.#topbar.draw();
  }
}
