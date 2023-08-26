import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
import { Game } from "../Game";
import { g, p8c } from "../globals";
import { Sash } from "../gui/Sash";
import { GameState } from "./GameState";
import { GameStateStart } from "./GameStateStart";

export class GameStateSplash implements GameState {
  readonly #sash: Sash = new Sash({
    duration: g.__quickStart ? 0 : 8 * g.musicBeatFrames,
    expand: false,
    drawText: (sashCenter) => {
      const title = "Avoid Your Past";
      const titleSize = Utils.measureText(title);
      const author = "by @beetrootpaul";
      const authorSize = Utils.measureText(author);
      Utils.printWithOutline(
        title,
        sashCenter.add(v_(-titleSize.x / 2, -authorSize.y - 3)),
        p8c.pink,
        p8c.black
      );
      BeetPx.print(author, sashCenter.add(v_(-authorSize.x / 2, 2)), p8c.white);
    },
  });

  constructor() {
    BeetPx.playSoundLooped(g.assets.musicBase);
    Game.playbackIds.melody = BeetPx.playSoundLooped(
      g.assets.musicMelody,
      true
    );
    Game.playbackIds.modeNoCoins = BeetPx.playSoundLooped(
      g.assets.musicModeNoCoins,
      true
    );
    Game.playbackIds.modeNoMemories = BeetPx.playSoundLooped(
      g.assets.musicModeNoMemories,
      true
    );
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (
      BeetPx.wasJustPressed("left") ||
      BeetPx.wasJustPressed("right") ||
      BeetPx.wasJustPressed("up") ||
      BeetPx.wasJustPressed("down")
    ) {
      this.#sash.collapse();
    }

    this.#sash.advance1Frame();

    return this;
  }

  draw(): void {
    BeetPx.rectFilled(g.cameraOffset, g.screenSize, g.colors.bgColorModeNormal);

    this.#sash.draw();
  }
}
