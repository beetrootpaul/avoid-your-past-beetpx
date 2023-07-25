import { BeetPx, BpxUtils, v_ } from "beetpx";
import { Level } from "../gameplay/Level";
import { Mode } from "../gameplay/Mode";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { g, p8c } from "../globals";
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
    BeetPx.muteSound(g.assets.musicMelody);
    BeetPx.muteSound(g.assets.musicModeNoCoins);
    BeetPx.muteSound(g.assets.musicModeNoMemories);

    this.#level.spawnItems();
  }

  update(): GameState {
    let hasStarted = false;
    // TODO: make one directional input clear another, like left+right = nothing
    if (BeetPx.continuousInputEvents.has("left")) {
      this.#player.directLeft();
      hasStarted = true;
    } else if (BeetPx.continuousInputEvents.has("right")) {
      this.#player.directRight();
      hasStarted = true;
    } else if (BeetPx.continuousInputEvents.has("up")) {
      this.#player.directUp();
      hasStarted = true;
    } else if (BeetPx.continuousInputEvents.has("down")) {
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
    const prompt1Size = BpxUtils.measureTextSize(prompt1);
    const prompt2Size = BpxUtils.measureTextSize(prompt2);
    BpxUtils.printWithOutline(
      prompt1,
      v_(
        this.#player.center().x - prompt1Size.x / 2,
        this.#player.xy1().y - margin - 26
      ),
      p8c.lavender,
      p8c.darkBlue
    );
    BpxUtils.printWithOutline(
      prompt2,
      v_(
        this.#player.center().x - prompt2Size.x / 2,
        this.#player.xy1().y - margin - 17
      ),
      p8c.lavender,
      p8c.darkBlue
    );
    const timeDependentBoolean = BpxUtils.booleanChangingEveryNthFrame(
      g.musicBeatFrames
    );
    const glyphColor = timeDependentBoolean ? p8c.blue : p8c.lavender;
    BpxUtils.printWithOutline(
      "⬅️",
      v_(this.#player.xy1().x - margin - 8, this.#player.center().y - 2),
      glyphColor,
      p8c.darkBlue
    );
    BpxUtils.printWithOutline(
      "➡️",
      v_(this.#player.xy2().x + margin + 2, this.#player.center().y - 2),
      glyphColor,
      p8c.darkBlue
    );
    BpxUtils.printWithOutline(
      "⬆️",
      v_(this.#player.center().x - 3, this.#player.xy1().y - margin - 6),
      glyphColor,
      p8c.darkBlue
    );
    BpxUtils.printWithOutline(
      "⬇️",
      v_(this.#player.center().x - 3, this.#player.xy2().y + margin + 2),
      glyphColor,
      p8c.darkBlue
    );
  }
}
