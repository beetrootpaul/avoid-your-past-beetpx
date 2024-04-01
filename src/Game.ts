import { b_, rgb_p8_, v_ } from "@beetpx/beetpx";
import { Pico8Font } from "./Pico8Font";
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
    b_.init({
      gameCanvasSize: "128x128",
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
          color: rgb_p8_.slate,
        },
      },
      frameByFrame: {
        available: !window.BEETPX__IS_PROD,
      },
    }).then(({ startGame }) => {
      b_.setOnStarted(() => {
        b_.setButtonRepeating("left", false);
        b_.setButtonRepeating("right", false);
        b_.setButtonRepeating("up", false);
        b_.setButtonRepeating("down", false);

        b_.useFont(new Pico8Font());
        b_.setCameraXy(g.cameraOffset);

        this.#gameState = new GameStateSplash();
      });

      b_.setOnUpdate(() => {
        this.#gameState = this.#gameState?.update();
      });

      b_.setOnDraw(() => {
        b_.clearCanvas(rgb_p8_.black);

        this.#gameState?.draw();

        if (b_.debug) {
          b_.drawText(
            `♪ ${b_.getAudioContext().state}`,
            g.cameraOffset.add(v_(0, g.screenSize.y - 6)),
            rgb_p8_.wine
          );
        }
      });

      startGame();
    });
  }
}
