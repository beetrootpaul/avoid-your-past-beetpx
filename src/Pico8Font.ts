import {
  CharSprite,
  FontId,
  ImageUrl,
  Sprite,
  Vector2d,
  spr_,
  type Font,
} from "@beetpx/beetpx";
import { g } from "./globals";

function c_(x1: number, y1: number, w: number = 3, h: number = 5): Sprite {
  return spr_(g.assets.pico8FontImage)(x1, y1, w, h);
}

export class Pico8Font implements Font {
  readonly id: FontId = g.assets.pico8FontId;

  readonly imageUrl: ImageUrl = g.assets.pico8FontImage;

  static #sprites: Record<string, Sprite> = {
    // TODO: externalize these emojis to constants for an easier re-use
    ["⬅️"]: c_(11, 8, 7),
    ["⬆️"]: c_(4, 9, 7),
    ["➡️"]: c_(1, 9, 7),
    ["⬇️"]: c_(3, 8, 7),
    ["♪"]: c_(13, 8, 7),
    //
    ["0"]: c_(0, 3),
    ["1"]: c_(1, 3),
    ["2"]: c_(2, 3),
    ["3"]: c_(3, 3),
    ["4"]: c_(4, 3),
    ["5"]: c_(5, 3),
    ["6"]: c_(6, 3),
    ["7"]: c_(7, 3),
    ["8"]: c_(8, 3),
    ["9"]: c_(9, 3),
    //
    ["@"]: c_(0, 4),
    //
    ["a"]: c_(1, 6),
    ["b"]: c_(2, 6),
    ["c"]: c_(3, 6),
    ["d"]: c_(4, 6),
    ["e"]: c_(5, 6),
    ["f"]: c_(6, 6),
    ["g"]: c_(7, 6),
    ["h"]: c_(8, 6),
    ["i"]: c_(9, 6),
    ["j"]: c_(10, 6),
    ["k"]: c_(11, 6),
    ["l"]: c_(12, 6),
    ["m"]: c_(13, 6),
    ["n"]: c_(14, 6),
    ["o"]: c_(15, 6),
    ["p"]: c_(0, 7),
    ["q"]: c_(1, 7),
    ["r"]: c_(2, 7),
    ["s"]: c_(3, 7),
    ["t"]: c_(4, 7),
    ["u"]: c_(5, 7),
    ["v"]: c_(6, 7),
    ["w"]: c_(7, 7),
    ["x"]: c_(8, 7),
    ["y"]: c_(9, 7),
    ["z"]: c_(10, 7),
  };

  // TODO: tests, especially to check that we iterate over emojis like "➡️" correctly
  spritesFor(text: string): CharSprite[] {
    const charSprites: CharSprite[] = [];
    let positionInText: Vector2d = Vector2d.zero;

    for (let i = 0; i < text.length; i += 1) {
      let char = text[i]!.toLowerCase();
      let sprite = Pico8Font.#sprites[char] ?? null;

      // Maybe it's a 2-chars long emoji?
      if (!sprite && i + 1 < text.length) {
        char += text[i + 1];
        sprite = Pico8Font.#sprites[char] ?? null;
      }

      if (sprite) {
        charSprites.push({ positionInText, sprite, char });
      }
      const jumpX = (sprite ?? c_(-1, -1)).size().x + 1;
      positionInText = positionInText.add(jumpX, 0);
    }

    return charSprites;
  }
}
