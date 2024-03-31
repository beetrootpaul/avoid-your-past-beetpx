import { b_, rgb_p8_, u_, v_ } from "@beetpx/beetpx";
import { Pico8Font } from "./Pico8Font";
import { GameState } from "./game_states/GameState";
import { GameStateSplash } from "./game_states/GameStateSplash";
import { g } from "./globals";

const averageRenderFps = {
  history: Array.from({ length: 8 }, () => 0),
  index: 0,
};

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
      debugMode: !BEETPX__IS_PROD,
      assets: {
        images: [{ url: g.assets.spritesheet }],
        fonts: [
          {
            font: new Pico8Font(),
            spriteTextColor: rgb_p8_.white,
          },
        ],
        sounds: [
          { url: g.assets.coinSfx },
          { url: g.assets.musicBase },
          { url: g.assets.musicMelody },
          { url: g.assets.musicModeNoCoins },
          { url: g.assets.musicModeNoMemories },
        ],
        jsons: [],
      },
    }).then(({ startGame }) => {
      b_.setOnStarted(() => {
        b_.setButtonRepeating("left", false);
        b_.setButtonRepeating("right", false);
        b_.setButtonRepeating("up", false);
        b_.setButtonRepeating("down", false);

        b_.setFont(g.assets.pico8FontId);
        b_.setCameraXy(g.cameraOffset);

        this.#gameState = new GameStateSplash();
      });

      b_.setOnUpdate(() => {
        this.#gameState = this.#gameState?.update();
      });

      b_.setOnDraw(() => {
        averageRenderFps.history[averageRenderFps.index++] = b_.renderingFps;
        averageRenderFps.index %= averageRenderFps.history.length;

        b_.clearCanvas(rgb_p8_.black);

        this.#gameState?.draw();

        if (b_.debug) {
          const fps = (
            averageRenderFps.history.reduce((sum, fps) => sum + fps, 0) /
            averageRenderFps.history.length
          ).toFixed(0);
          b_.drawText(
            fps,
            g.cameraOffset.add(
              v_(
                g.screenSize.x - u_.measureText(fps)[1].x - 1,
                g.screenSize.y - 6
              )
            ),
            rgb_p8_.slate
          );

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
