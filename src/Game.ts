import { xy_ } from "beetpx";
import { GameState } from "./game_states/GameState";
import { GameStateSplash } from "./game_states/GameStateSplash";
import { f, g, p8c, u } from "./globals";
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
    f.init(
      {
        htmlCanvasBackground: p8c.black,
        gameCanvasSize: g.screenSize,
        desiredFps: g.fps,
        // TODO: consider disabling these logs in the production build
        logActualFps: true,
        // TODO: make it disabled for prod and toggleable for dev
        debug: {
          enabledOnInit: g.__debug,
          toggleKey: ";",
        },
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

      f.drawApi.setFont(g.assets.pico8Font);

      f.setOnUpdate(() => {
        f.storageApi.store<GameStoredState>({
          mostRecentFameNumber: f.frameNumber,
        });
        this.#gameState = this.#gameState?.update();
      });

      f.setOnDraw(() => {
        f.drawApi.clear(p8c.black);
        f.drawApi.setCameraOffset(g.cameraOffset);
        this.#gameState?.draw();

        if (f.debug) {
          const fps = f.averageFps.toFixed(0);
          f.drawApi.print(
            fps,
            g.cameraOffset.add(
              xy_(
                g.screenSize.x - u.measureTextSize(fps).x - 1,
                g.screenSize.y - 6
              )
            ),
            p8c.darkGrey
          );
          f.drawApi.print(
            `♪ ${f.audio.audioContext.state}`,
            g.cameraOffset.add(xy_(0, g.screenSize.y - 6)),
            p8c.darkPurple
          );
        }
      });

      startGame(() => {
        let restoredState: GameStoredState | null = null;
        try {
          restoredState = f.storageApi.load<GameStoredState>();
        } catch (err) {
          // TODO: move this error to the framework itself, because there we can explicitly tell it's about `JSON.parse(…)` error
          console.warn("Failed to stored state.");
          f.storageApi.clear();
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
