import { b_, rgb_p8_, u_, v_ } from "@beetpx/beetpx";
import { Game } from "../Game";
import { g } from "../globals";
import { Sash } from "../gui/Sash";
import { GameState } from "./GameState";
import { GameStateStart } from "./GameStateStart";

export class GameStateSplash implements GameState {
  readonly #sash: Sash = new Sash({
    duration: g.__quickStart ? 0 : 8 * g.musicBeatFrames,
    expand: false,
    drawText: (sashCenter) => {
      const title = "Avoid Your Past";
      const titleSize = b_.measureText(title).wh;
      const author = "by @beetrootpaul";
      const authorSize = b_.measureText(author).wh;
      u_.drawTextWithOutline(
        title,
        sashCenter.add(v_(-titleSize.x / 2, -authorSize.y - 3)),
        rgb_p8_.pink,
        rgb_p8_.black
      );
      b_.drawText(
        author,
        sashCenter.add(v_(-authorSize.x / 2, 2)),
        rgb_p8_.white
      );
    },
  });

  constructor() {
    b_.startPlaybackLooped(g.assets.musicBase);
    Game.playbackIds.melody = b_.startPlaybackLooped(g.assets.musicMelody, {
      muteOnStart: true,
    });
    Game.playbackIds.modeNoCoins = b_.startPlaybackLooped(
      g.assets.musicModeNoCoins,
      { muteOnStart: true }
    );
    Game.playbackIds.modeNoMemories = b_.startPlaybackLooped(
      g.assets.musicModeNoMemories,
      { muteOnStart: true }
    );
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (
      b_.wasButtonJustPressed("left") ||
      b_.wasButtonJustPressed("right") ||
      b_.wasButtonJustPressed("up") ||
      b_.wasButtonJustPressed("down")
    ) {
      this.#sash.collapse();
    }

    this.#sash.advance1Frame();

    return this;
  }

  draw(): void {
    b_.drawRectFilled(g.cameraOffset, g.screenSize, g.colors.bgColorModeNormal);

    this.#sash.draw();
  }
}
