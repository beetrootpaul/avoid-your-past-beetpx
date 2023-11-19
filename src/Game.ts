import { b_, u_, v_ } from "@beetpx/beetpx";
import { Pico8Font } from "./Pico8Font";
import { GameState } from "./game_states/GameState";
import { GameStateSplash } from "./game_states/GameStateSplash";
import { c, g } from "./globals";

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
    b_.init(
      {
        gameCanvasSize: "128x128",
        desiredUpdateFps: 30,
        debugFeatures: !BEETPX__IS_PROD,
      },
      {
        images: [{ url: g.assets.spritesheet }],
        fonts: [
          {
            font: new Pico8Font(),
            spriteTextColor: c.white,
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
      }
    ).then(({ startGame }) => {
      b_.setOnStarted(() => {
        b_.setRepeating("left", false);
        b_.setRepeating("right", false);
        b_.setRepeating("up", false);
        b_.setRepeating("down", false);

        b_.setFont(g.assets.pico8FontId);
        b_.setCameraXy(g.cameraOffset);

        this.#gameState = new GameStateSplash();
      });

      b_.setOnUpdate(() => {
        this.#gameState = this.#gameState?.update();
      });

      b_.setOnDraw(() => {
        averageRenderFps.history[averageRenderFps.index++] = b_.renderFps;
        averageRenderFps.index %= averageRenderFps.history.length;

        b_.clearCanvas(c.black);

        this.#gameState?.draw();

        if (b_.debug) {
          const fps = (
            averageRenderFps.history.reduce((sum, fps) => sum + fps, 0) /
            averageRenderFps.history.length
          ).toFixed(0);
          b_.print(
            fps,
            g.cameraOffset.add(
              v_(
                g.screenSize.x - u_.measureText(fps)[1].x - 1,
                g.screenSize.y - 6
              )
            ),
            c.darkGrey
          );

          b_.print(
            `♪ ${b_.__internal__audioContext().state}`,
            g.cameraOffset.add(v_(0, g.screenSize.y - 6)),
            c.darkPurple
          );
        }
      });

      startGame();
    });
  }
}
