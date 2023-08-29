import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
import { Pico8Font } from "./Pico8Font";
import { GameState } from "./game_states/GameState";
import { GameStateSplash } from "./game_states/GameStateSplash";
import { g, p8c } from "./globals";

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
    BeetPx.init(
      {
        gameCanvasSize: "128x128",
        desiredUpdateFps: 30,
        visibleTouchButtons: ["left", "right", "up", "down"],
        debug: {
          available: !__BEETPX_IS_PROD__,
          toggleKey: ";",
          frameByFrame: {
            activateKey: ",",
            stepKey: ".",
          },
        },
      },
      {
        images: [{ url: g.assets.spritesheet }],
        fonts: [
          {
            font: new Pico8Font(),
            imageTextColor: p8c.white,
            imageBgColor: p8c.black,
          },
        ],
        sounds: [
          { url: g.assets.coinSfx },
          { url: g.assets.musicBase },
          { url: g.assets.musicMelody },
          { url: g.assets.musicModeNoCoins },
          { url: g.assets.musicModeNoMemories },
        ],
      }
    ).then(({ startGame }) => {
      BeetPx.setOnStarted(() => {
        BeetPx.setRepeating("left", false);
        BeetPx.setRepeating("right", false);
        BeetPx.setRepeating("up", false);
        BeetPx.setRepeating("down", false);

        BeetPx.setFont(g.assets.pico8FontId);
        BeetPx.setCameraOffset(g.cameraOffset);

        this.#gameState = new GameStateSplash();
      });

      BeetPx.setOnUpdate(() => {
        this.#gameState = this.#gameState?.update();
      });

      BeetPx.setOnDraw(() => {
        averageRenderFps.history[averageRenderFps.index++] = BeetPx.renderFps;
        averageRenderFps.index %= averageRenderFps.history.length;

        BeetPx.clearCanvas(p8c.black);

        this.#gameState?.draw();

        if (BeetPx.debug) {
          const fps = (
            averageRenderFps.history.reduce((sum, fps) => sum + fps, 0) /
            averageRenderFps.history.length
          ).toFixed(0);
          BeetPx.print(
            fps,
            g.cameraOffset.add(
              v_(
                g.screenSize.x - Utils.measureText(fps).x - 1,
                g.screenSize.y - 6
              )
            ),
            p8c.darkGrey
          );

          BeetPx.print(
            `♪ ${BeetPx.audioContext.state}`,
            g.cameraOffset.add(v_(0, g.screenSize.y - 6)),
            p8c.darkPurple
          );
        }
      });

      startGame();
    });
  }
}
