import { b_, u_, v_ } from "@beetpx/beetpx";
import { Game } from "../Game";
import { Level } from "../gameplay/Level";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { c, g } from "../globals";
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
    duration: 8 * g.musicBeatFrames,
    expand: true,
    drawText: (sashCenter) => {
      const heading = "your score";
      const headingSize = u_.measureText(heading)[1];
      const finalScore = this.#score.value().toFixed(0);
      const finalScoreSize = u_.measureText(finalScore)[1];
      b_.drawText(
        heading,
        sashCenter.add(v_(-headingSize.x / 2, -headingSize.y - 3)),
        c.white
      );
      u_.drawTextWithOutline(
        finalScore,
        sashCenter.add(v_(-finalScoreSize.x / 2, 2)),
        c.pink,
        c.black
      );
    },
  });

  constructor(params: GameStateOverParams) {
    this.#score = params.score;
    this.#level = params.level;
    this.#player = params.player;

    b_.mutePlayback(Game.playbackIds.melody);
    b_.mutePlayback(Game.playbackIds.modeNoCoins);
    b_.mutePlayback(Game.playbackIds.modeNoMemories);
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (this.#sash.hasExpanded()) {
      if (
        b_.wasButtonJustPressed("left") ||
        b_.wasButtonJustPressed("right") ||
        b_.wasButtonJustPressed("up") ||
        b_.wasButtonJustPressed("down")
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
