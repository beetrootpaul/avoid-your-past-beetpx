import { xy_ } from "beetpx";
import { f, g, p8c, u } from "../globals";
import { Sash } from "../gui/Sash";
import { GameState } from "./GameState";
import { GameStateStart } from "./GameStateStart";

export class GameStateSplash implements GameState {
  readonly #sash: Sash = new Sash({
    duration: g.__quickStart ? 0 : 10 * g.musicBeatFrames,
    expand: false,
    drawText: (sashCenter) => {
      const title = "Avoid Your Past";
      const titleSize = u.measureTextSize(title);
      const author = "by @beetrootpaul";
      const authorSize = u.measureTextSize(author);
      u.printWithOutline(
        title,
        sashCenter.add(xy_(-titleSize.x / 2, -authorSize.y - 3)),
        p8c.pink,
        p8c.black
      );
      f.drawApi.print(
        author,
        sashCenter.add(xy_(-authorSize.x / 2, 2)),
        p8c.white
      );
    },
  });

  constructor() {
    f.audio.playSoundLooped(g.assets.musicBase);
    f.audio.playSoundLooped(g.assets.musicMelody, true);
    f.audio.playSoundLooped(g.assets.musicModeNoCoins, true);
    f.audio.playSoundLooped(g.assets.musicModeNoMemories, true);
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (
      f.continuousInputEvents.has("left") ||
      f.continuousInputEvents.has("right") ||
      f.continuousInputEvents.has("up") ||
      f.continuousInputEvents.has("down")
    ) {
      this.#sash.collapse();
    }

    this.#sash.advance1Frame();

    return this;
  }

  draw(): void {
    f.drawApi.rectFilled(
      g.cameraOffset,
      g.cameraOffset.add(g.screenSize),
      g.colors.bgColorModeNormal
    );

    this.#sash.draw();
  }
}
