import { BeetPx, BpxUtils, v_ } from "beetpx";
import { g, p8c } from "../globals";
import { Sash } from "../gui/Sash";
import { GameState } from "./GameState";
import { GameStateStart } from "./GameStateStart";

export class GameStateSplash implements GameState {
  readonly #sash: Sash = new Sash({
    duration: g.__quickStart ? 0 : 10 * g.musicBeatFrames,
    expand: false,
    drawText: (sashCenter) => {
      const title = "Avoid Your Past";
      const titleSize = BpxUtils.measureTextSize(title);
      const author = "by @beetrootpaul";
      const authorSize = BpxUtils.measureTextSize(author);
      BpxUtils.printWithOutline(
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
    BeetPx.playSoundLooped(g.assets.musicMelody, true);
    BeetPx.playSoundLooped(g.assets.musicModeNoCoins, true);
    BeetPx.playSoundLooped(g.assets.musicModeNoMemories, true);
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (
      BeetPx.continuousInputEvents.has("left") ||
      BeetPx.continuousInputEvents.has("right") ||
      BeetPx.continuousInputEvents.has("up") ||
      BeetPx.continuousInputEvents.has("down")
    ) {
      this.#sash.collapse();
    }

    this.#sash.advance1Frame();

    return this;
  }

  draw(): void {
    BeetPx.rectFilled(
      g.cameraOffset,
      g.cameraOffset.add(g.screenSize),
      g.colors.bgColorModeNormal
    );

    this.#sash.draw();
  }
}
