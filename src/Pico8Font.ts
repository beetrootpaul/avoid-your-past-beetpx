import { CharSprite, Sprite, Vector2d, v_, type Font } from "@beetpx/beetpx";

export class Pico8Font implements Font {
  static #letterSpacingW = 1;

  static #defaultCharSpriteSize = v_(3, 5);

  static #spriteSheetCells: Record<string, Vector2d> = {
    // TODO: externalize these emojis to constants for an easier re-use
    ["⬅️"]: v_(11, 8),
    ["⬆️"]: v_(4, 9),
    ["➡️"]: v_(1, 9),
    ["⬇️"]: v_(3, 8),
    ["♪"]: v_(13, 8),
    //
    ["0"]: v_(0, 3),
    ["1"]: v_(1, 3),
    ["2"]: v_(2, 3),
    ["3"]: v_(3, 3),
    ["4"]: v_(4, 3),
    ["5"]: v_(5, 3),
    ["6"]: v_(6, 3),
    ["7"]: v_(7, 3),
    ["8"]: v_(8, 3),
    ["9"]: v_(9, 3),
    //
    ["@"]: v_(0, 4),
    //
    ["a"]: v_(1, 6),
    ["b"]: v_(2, 6),
    ["c"]: v_(3, 6),
    ["d"]: v_(4, 6),
    ["e"]: v_(5, 6),
    ["f"]: v_(6, 6),
    ["g"]: v_(7, 6),
    ["h"]: v_(8, 6),
    ["i"]: v_(9, 6),
    ["j"]: v_(10, 6),
    ["k"]: v_(11, 6),
    ["l"]: v_(12, 6),
    ["m"]: v_(13, 6),
    ["n"]: v_(14, 6),
    ["o"]: v_(15, 6),
    ["p"]: v_(0, 7),
    ["q"]: v_(1, 7),
    ["r"]: v_(2, 7),
    ["s"]: v_(3, 7),
    ["t"]: v_(4, 7),
    ["u"]: v_(5, 7),
    ["v"]: v_(6, 7),
    ["w"]: v_(7, 7),
    ["x"]: v_(8, 7),
    ["y"]: v_(9, 7),
    ["z"]: v_(10, 7),
  };

  static #charSpriteSizes: Record<string, Vector2d> = {
    // TODO: externalize these emojis to constants for an easier re-use
    ["⬅️"]: v_(7, 5),
    ["⬆️"]: v_(7, 5),
    ["➡️"]: v_(7, 5),
    ["⬇️"]: v_(7, 5),
    ["♪"]: v_(7, 5),
  };

  static #spriteFor(char: string): Sprite | null {
    char = char.toLowerCase();
    const cell = Pico8Font.#spriteSheetCells[char];
    if (!cell) return null;
    const size = Pico8Font.#charSpriteSizes[char];
    return new Sprite(
      cell.mul(8),
      cell.mul(8).add(size ?? Pico8Font.#defaultCharSpriteSize)
    );
  }

  // TODO: tests, especially to check that we iterate over emojis like "➡️" correctly
  spritesFor(text: string): CharSprite[] {
    const charSprites: CharSprite[] = [];
    let positionInText: Vector2d = Vector2d.zero;

    for (let i = 0; i < text.length; i += 1) {
      let char = text[i]!;
      let sprite = Pico8Font.#spriteFor(char);

      // Maybe it's a 2-chars long emoji?
      if (!sprite && i + 1 < text.length) {
        char += text[i + 1];
        sprite = Pico8Font.#spriteFor(char);
      }

      if (sprite) {
        charSprites.push({ positionInText, sprite });
        positionInText = positionInText.add(
          v_(Pico8Font.#defaultCharSpriteSize.x + Pico8Font.#letterSpacingW, 0)
        );
      } else {
        positionInText = positionInText.add(
          v_(Pico8Font.#defaultCharSpriteSize.x + Pico8Font.#letterSpacingW, 0)
        );
      }
    }

    return charSprites;
  }
}
