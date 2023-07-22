import { xy_ } from "beetpx";
import { Level } from "../gameplay/Level";
import { Mode } from "../gameplay/Mode";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { f, g, p8c, u } from "../globals";
import { Topbar } from "../gui/Topbar";
import { GameState } from "./GameState";
import { GameStateGameplay } from "./GameStateGameplay";

export class GameStateStart implements GameState {
  readonly #score = new Score();
  readonly #mode = new Mode();
  readonly #topbar = new Topbar({
    score: this.#score,
    mode: this.#mode,
  });
  readonly #player = new Player();
  readonly #level = new Level({
    mode: this.#mode,
    player: this.#player,
  });

  constructor() {
    // TODO: migrate from Lua
    // audio.enable_music_layers { false, false, false }

    this.#level.spawnItems();
  }

  update(): GameState {
    let hasStarted = false;
    // TODO: make one directional input clear another, like left+right = nothing
    if (f.continuousInputEvents.has("left")) {
      this.#player.directLeft();
      hasStarted = true;
    } else if (f.continuousInputEvents.has("right")) {
      this.#player.directRight();
      hasStarted = true;
    } else if (f.continuousInputEvents.has("up")) {
      this.#player.directUp();
      hasStarted = true;
    } else if (f.continuousInputEvents.has("down")) {
      this.#player.directDown();
      hasStarted = true;
    }

    this.#level.animate();

    if (hasStarted) {
      return new GameStateGameplay({
        mode: this.#mode,
        topbar: this.#topbar,
        score: this.#score,
        level: this.#level,
        player: this.#player,
      });
    }

    return this;
  }

  draw(): void {
    this.#level.drawBg();

    this.#level.drawItems();

    this.#player.draw();

    this.#topbar.draw();

    const margin = 6;
    const prompt1 = "press an arrow";
    const prompt2 = "to choose direction";
    const prompt1Size = u.measureTextSize(prompt1);
    const prompt2Size = u.measureTextSize(prompt2);
    u.printWithOutline(
      prompt1,
      xy_(
        this.#player.center().x - prompt1Size.x / 2,
        this.#player.xy1().y - margin - 26
      ),
      p8c.lavender,
      p8c.darkBlue
    );
    u.printWithOutline(
      prompt2,
      xy_(
        this.#player.center().x - prompt2Size.x / 2,
        this.#player.xy1().y - margin - 17
      ),
      p8c.lavender,
      p8c.darkBlue
    );
    const timeDependentBoolean = u.booleanChangingEveryNthFrame(
      g.musicBeatFrames
    );
    const glyphColor = timeDependentBoolean ? p8c.blue : p8c.lavender;
    u.printWithOutline(
      "⬅️",
      xy_(this.#player.xy1().x - margin - 8, this.#player.center().y - 2),
      glyphColor,
      p8c.darkBlue
    );
    u.printWithOutline(
      "➡️",
      xy_(this.#player.xy2().x + margin + 2, this.#player.center().y - 2),
      glyphColor,
      p8c.darkBlue
    );
    u.printWithOutline(
      "⬆️",
      xy_(this.#player.center().x - 3, this.#player.xy1().y - margin - 6),
      glyphColor,
      p8c.darkBlue
    );
    u.printWithOutline(
      "⬇️",
      xy_(this.#player.center().x - 3, this.#player.xy2().y + margin + 2),
      glyphColor,
      p8c.darkBlue
    );
  }
}
