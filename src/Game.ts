import { BeetPx, BpxUtils, v_ } from "beetpx";
import { GameState } from "./game_states/GameState";
import { GameStateSplash } from "./game_states/GameStateSplash";
import { g, p8c } from "./globals";
import { Pico8Font } from "./Pico8Font";

type GameStoredState = {
  // TODO: Is it possible to enforce optionality of every field in the framework itself?
  // TODO: This field is used only to drive a proper framework implementation,
  //       but it's not really used in the game itself.
  //       Update it to something meaningful in a context of the game.
  mostRecentFameNumber?: number;
};

export class Game {
  #gameState: GameState | undefined;

  start(): void {
    BeetPx.init(
      {
        htmlCanvasBackground: p8c.black,
        gameCanvasSize: g.screenSize,
        desiredFps: g.fps,
        logActualFps: g.__debug,
        debug: g.__debug
          ? {
              enabledOnInit: g.__debug,
              toggleKey: ";",
            }
          : undefined,
      },
      {
        images: [{ url: g.assets.spritesheet }],
        fonts: [
          {
            font: new Pico8Font(),
            url: g.assets.pico8Font,
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

      BeetPx.setFont(g.assets.pico8Font);

      BeetPx.setOnUpdate(() => {
        BeetPx.store<GameStoredState>({
          mostRecentFameNumber: BeetPx.frameNumber,
        });
        this.#gameState = this.#gameState?.update();
      });

      BeetPx.setOnDraw(() => {
        BeetPx.clearCanvas(p8c.black);
        BeetPx.setCameraOffset(g.cameraOffset);
        this.#gameState?.draw();

        if (BeetPx.debug) {
          const fps = BeetPx.averageFps.toFixed(0);
          BeetPx.print(
            fps,
            g.cameraOffset.add(
              v_(
                g.screenSize.x - BpxUtils.measureTextSize(fps).x - 1,
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

      startGame(() => {
        let restoredState: GameStoredState | null = null;
        try {
          restoredState = BeetPx.load<GameStoredState>();
        } catch (err) {
          // TODO: move this error to the framework itself, because there we can explicitly tell it's about `JSON.parse(…)` error
          console.warn("Failed to stored state.");
          BeetPx.clearStorage();
        }
        restoredState = restoredState ?? {
          mostRecentFameNumber: 0,
        };
        console.info(
          `Restored most recent frame number: ${restoredState.mostRecentFameNumber}`
        );
      });
    });
  }
}
