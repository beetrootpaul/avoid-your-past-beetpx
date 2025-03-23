import { $d, $rgb_p8, $u, $v, $x } from "@beetpx/beetpx";
import { Game } from "../Game";
import { g } from "../globals";
import { Sash } from "../gui/Sash";
import { GameState } from "./GameState";
import { GameStateStart } from "./GameStateStart";

export class GameStateSplash implements GameState {
  readonly #sash: Sash = new Sash({
    duration: g.__quickStart ? 0 : 8 * g.musicBeatFrames,
    expand: false,
    drawText: sashCenter => {
      const title = "Avoid Your Past";
      const titleSize = $d.measureText(title).wh;
      const author = "by @beetrootpaul";
      const authorSize = $d.measureText(author).wh;
      $u.drawTextWithOutline(
        title,
        sashCenter.add($v(-titleSize.x / 2, -authorSize.y - 3)),
        $rgb_p8.pink,
        $rgb_p8.black,
      );
      $d.text(author, sashCenter.add($v(-authorSize.x / 2, 2)), $rgb_p8.white);
    },
  });

  constructor() {
    $x.startPlaybackLooped(g.assets.musicBase);
    Game.playbackIds.melody = $x.startPlaybackLooped(g.assets.musicMelody, {
      muteOnStart: true,
    });
    Game.playbackIds.modeNoCoins = $x.startPlaybackLooped(
      g.assets.musicModeNoCoins,
      { muteOnStart: true },
    );
    Game.playbackIds.modeNoMemories = $x.startPlaybackLooped(
      g.assets.musicModeNoMemories,
      { muteOnStart: true },
    );
  }

  update(): GameState {
    if (this.#sash.has_collapsed()) {
      return new GameStateStart();
    }

    if (
      $x.wasButtonJustPressed("left") ||
      $x.wasButtonJustPressed("right") ||
      $x.wasButtonJustPressed("up") ||
      $x.wasButtonJustPressed("down")
    ) {
      this.#sash.collapse();
    }

    this.#sash.advance1Frame();

    return this;
  }

  draw(): void {
    $d.rectFilled(g.cameraOffset, g.screenSize, g.colors.bgColorModeNormal);

    this.#sash.draw();
  }
}
