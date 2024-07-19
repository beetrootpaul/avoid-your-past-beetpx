import { $, $d, $font_pico8, $rgb_p8, $v } from "@beetpx/beetpx";
import { GameState } from "./game_states/GameState";
import { GameStateSplash } from "./game_states/GameStateSplash";
import { g } from "./globals";

export class Game {
  static playbackIds = {
    melody: -1,
    modeNoCoins: -1,
    modeNoMemories: -1,
  };

  #gameState: GameState | undefined;

  start(): void {
    $.init({
      canvasSize: "128x128",
      fixedTimestep: "30fps",
      assets: [
        g.assets.spritesheet,
        g.assets.coinSfx,
        g.assets.musicBase,
        g.assets.musicMelody,
        g.assets.musicModeNoCoins,
        g.assets.musicModeNoMemories,
      ],
      debugMode: {
        available: !window.BEETPX__IS_PROD,
        fpsDisplay: {
          enabled: true,
          placement: "bottom-right",
          color: $rgb_p8.slate,
        },
      },
      frameByFrame: {
        available: !window.BEETPX__IS_PROD,
      },
    }).then(async ({ startGame }) => {
      $.setOnStarted(() => {
        $d.useFont($font_pico8);
        $d.setCameraXy(g.cameraOffset);

        this.#gameState = new GameStateSplash();
      });

      $.setOnUpdate(() => {
        this.#gameState = this.#gameState?.update();
      });

      $.setOnDraw(() => {
        $d.clearCanvas($rgb_p8.black);

        this.#gameState?.draw();

        if ($.debug) {
          $d.text(
            `♪ ${$.getAudioContext().state}`,
            g.cameraOffset.add($v(0, g.screenSize.y - 6)),
            $rgb_p8.wine,
          );
        }
      });

      await startGame();
    });
  }
}
