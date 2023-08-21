import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
import { Pico8Font } from "./Pico8Font";
import { GameState } from "./game_states/GameState";
import { GameStateSplash } from "./game_states/GameStateSplash";
import { g, p8c } from "./globals";

type GameStoredState = {
  // TODO: Is it possible to enforce optionality of every field in the framework itself?
  // TODO: This field is used only to drive a proper framework implementation,
  //       but it's not really used in the game itself.
  //       Update it to something meaningful in a context of the game.
  mostRecentFameNumber?: number;
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
        desiredFps: g.fps,
        // TODO: add menu and implement pause menu
        visibleTouchButtons: ["left", "right", "up", "down"],
        logActualFps: !__BEETPX_IS_PROD__,
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
      this.#gameState = new GameStateSplash();

      BeetPx.setFont(g.assets.pico8FontId);
      BeetPx.setCameraOffset(g.cameraOffset);

      // TODO: setOnStart
      // TODO: button repeating false
      // TODO: fix drawing
      // TODO: fix music
      // TODO: true lines

      BeetPx.setOnUpdate(() => {
        BeetPx.store<GameStoredState>({
          mostRecentFameNumber: BeetPx.frameNumber,
        });
        this.#gameState = this.#gameState?.update();
      });

      BeetPx.setOnDraw(() => {
        BeetPx.clearCanvas(p8c.black);
        this.#gameState?.draw();

        if (BeetPx.debug) {
          const fps = BeetPx.averageFps.toFixed(0);
          BeetPx.print(
            fps,
            g.cameraOffset.add(
              v_(
                g.screenSize.x - Utils.measureTextSize(fps).x - 1,
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
