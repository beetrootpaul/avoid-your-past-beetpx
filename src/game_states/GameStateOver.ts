import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
import { Level } from "../gameplay/Level";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { g, p8c } from "../globals";
import { Sash } from "../gui/Sash";
import { GameState } from "./GameState";
import { GameStateStart } from "./GameStateStart";

type GameStateOverParams = {
  score: Score;
  level: Level;
  player: Player;
};

export class GameStateOver implements GameState {
  readonly #score: Score;
  readonly #level: Level;
  readonly #player: Player;

  readonly #sash: Sash = new Sash({
    duration: 10 * g.musicBeatFrames,
    expand: true,
    drawText: (sashCenter) => {
      const heading = "your score";
      const headingSize = Utils.measureTextSize(heading);
      const finalScore = this.#score.value().toFixed(0);
      const finalScoreSize = Utils.measureTextSize(finalScore);
      BeetPx.print(
        heading,
        sashCenter.add(v_(-headingSize.x / 2, -headingSize.y - 3)),
        p8c.white
      );
      Utils.printWithOutline(
        finalScore,
        sashCenter.add(v_(-finalScoreSize.x / 2, 2)),
        p8c.pink,
        p8c.black
      );
    },
  });

  constructor(params: GameStateOverParams) {
    this.#score = params.score;
    this.#level = params.level;
    this.#player = params.player;

    BeetPx.muteSound(g.assets.musicMelody);
    BeetPx.muteSound(g.assets.musicModeNoCoins);
    BeetPx.muteSound(g.assets.musicModeNoMemories);
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (this.#sash.hasExpanded()) {
      if (
        BeetPx.continuousInputEvents.has("left") ||
        BeetPx.continuousInputEvents.has("right") ||
        BeetPx.continuousInputEvents.has("up") ||
        BeetPx.continuousInputEvents.has("down")
      ) {
        this.#sash.collapse();
      }
    }

    this.#sash.advance1Frame();

    return this;
  }

  draw(): void {
    this.#level.drawBg();

    this.#level.drawItems();

    this.#player.draw();

    this.#sash.draw();
  }
}
