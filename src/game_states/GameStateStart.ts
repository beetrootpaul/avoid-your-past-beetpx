import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
import { Direction } from "../gameplay/Direction";
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
    const detectedDirections: Direction[] = [];
    if (BeetPx.continuousInputEvents.has("left")) detectedDirections.push("l");
    if (BeetPx.continuousInputEvents.has("right")) detectedDirections.push("r");
    if (BeetPx.continuousInputEvents.has("up")) detectedDirections.push("u");
    if (BeetPx.continuousInputEvents.has("down")) detectedDirections.push("d");
    if (detectedDirections.length === 1) {
      detectedDirections.forEach(this.#player.direct.bind(this.#player));
    }

    this.#level.animate();

    if (detectedDirections.length === 1) {
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
    const prompt1Size = Utils.measureTextSize(prompt1);
    const prompt2Size = Utils.measureTextSize(prompt2);
    Utils.printWithOutline(
      prompt1,
      v_(
        this.#player.center().x - prompt1Size.x / 2,
        this.#player.xy1().y - margin - 26
      ),
      p8c.lavender,
      p8c.darkBlue
    );
    Utils.printWithOutline(
      prompt2,
      v_(
        this.#player.center().x - prompt2Size.x / 2,
        this.#player.xy1().y - margin - 17
      ),
      p8c.lavender,
      p8c.darkBlue
    );
    const timeDependentBoolean = Utils.booleanChangingEveryNthFrame(
      g.musicBeatFrames
    );
    const glyphColor = timeDependentBoolean ? p8c.blue : p8c.lavender;
    Utils.printWithOutline(
      "⬅️",
      v_(this.#player.xy1().x - margin - 8, this.#player.center().y - 2),
      glyphColor,
      p8c.darkBlue
    );
    Utils.printWithOutline(
      "➡️",
      v_(this.#player.xy2().x + margin + 2, this.#player.center().y - 2),
      glyphColor,
      p8c.darkBlue
    );
    Utils.printWithOutline(
      "⬆️",
      v_(this.#player.center().x - 3, this.#player.xy1().y - margin - 6),
      glyphColor,
      p8c.darkBlue
    );
    Utils.printWithOutline(
      "⬇️",
      v_(this.#player.center().x - 3, this.#player.xy2().y + margin + 2),
      glyphColor,
      p8c.darkBlue
    );
  }
}
