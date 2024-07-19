import { $, $d, $rgb_p8, $u, $v } from "@beetpx/beetpx";
import { Game } from "../Game";
import { Level } from "../gameplay/Level";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { g } from "../globals";
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
    drawText: sashCenter => {
      const heading = "your score";
      const headingSize = $d.measureText(heading).wh;
      const finalScore = this.#score.value().toFixed(0);
      const finalScoreSize = $d.measureText(finalScore).wh;
      $d.text(
        heading,
        sashCenter.add($v(-headingSize.x / 2, -headingSize.y - 3)),
        $rgb_p8.white,
      );
      $u.drawTextWithOutline(
        finalScore,
        sashCenter.add($v(-finalScoreSize.x / 2, 2)),
        $rgb_p8.pink,
        $rgb_p8.black,
      );
    },
  });

  constructor(params: GameStateOverParams) {
    this.#score = params.score;
    this.#level = params.level;
    this.#player = params.player;

    $.mutePlayback(Game.playbackIds.melody);
    $.mutePlayback(Game.playbackIds.modeNoCoins);
    $.mutePlayback(Game.playbackIds.modeNoMemories);
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (this.#sash.hasExpanded()) {
      if (
        $.wasButtonJustPressed("left") ||
        $.wasButtonJustPressed("right") ||
        $.wasButtonJustPressed("up") ||
        $.wasButtonJustPressed("down")
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
