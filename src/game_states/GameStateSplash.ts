import { b_, u_, v_ } from "@beetpx/beetpx";
import { Game } from "../Game";
import { c, g } from "../globals";
import { Sash } from "../gui/Sash";
import { GameState } from "./GameState";
import { GameStateStart } from "./GameStateStart";

export class GameStateSplash implements GameState {
  readonly #sash: Sash = new Sash({
    duration: g.__quickStart ? 0 : 8 * g.musicBeatFrames,
    expand: false,
    drawText: (sashCenter) => {
      const title = "Avoid Your Past";
      const titleSize = u_.measureText(title);
      const author = "by @beetrootpaul";
      const authorSize = u_.measureText(author);
      u_.printWithOutline(
        title,
        sashCenter.add(v_(-titleSize.x / 2, -authorSize.y - 3)),
        c.pink,
        c.black
      );
      b_.print(author, sashCenter.add(v_(-authorSize.x / 2, 2)), c.white);
    },
  });

  constructor() {
    b_.playSoundLooped(g.assets.musicBase);
    Game.playbackIds.melody = b_.playSoundLooped(g.assets.musicMelody, true);
    Game.playbackIds.modeNoCoins = b_.playSoundLooped(
      g.assets.musicModeNoCoins,
      true
    );
    Game.playbackIds.modeNoMemories = b_.playSoundLooped(
      g.assets.musicModeNoMemories,
      true
    );
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (
      b_.wasJustPressed("left") ||
      b_.wasJustPressed("right") ||
      b_.wasJustPressed("up") ||
      b_.wasJustPressed("down")
    ) {
      this.#sash.collapse();
    }

    this.#sash.advance1Frame();

    return this;
  }

  draw(): void {
    b_.rectFilled(g.cameraOffset, g.screenSize, g.colors.bgColorModeNormal);

    this.#sash.draw();
  }
}
