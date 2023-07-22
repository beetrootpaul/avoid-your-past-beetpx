import { xy_ } from "beetpx";
import { Level } from "../gameplay/Level";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { f, g, p8c, u } from "../globals";
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
      const headingSize = u.measureTextSize(heading);
      const finalScore = this.#score.value().toFixed(0);
      const finalScoreSize = u.measureTextSize(finalScore);
      f.drawApi.print(
        heading,
        sashCenter.add(xy_(-headingSize.x / 2, -headingSize.y - 3)),
        p8c.white
      );
      u.printWithOutline(
        finalScore,
        sashCenter.add(xy_(-finalScoreSize.x / 2, 2)),
        p8c.pink,
        p8c.black
      );
    },
  });

  constructor(params: GameStateOverParams) {
    this.#score = params.score;
    this.#level = params.level;
    this.#player = params.player;

    f.audio.muteSound(g.assets.musicMelody);
    f.audio.muteSound(g.assets.musicModeNoCoins);
    f.audio.muteSound(g.assets.musicModeNoMemories);
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (this.#sash.hasExpanded()) {
      if (
        f.continuousInputEvents.has("left") ||
        f.continuousInputEvents.has("right") ||
        f.continuousInputEvents.has("up") ||
        f.continuousInputEvents.has("down")
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
