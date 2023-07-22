import { CharSprite, type Font, Sprite, Xy, xy_ } from "beetpx";

export class Pico8Font implements Font {
  static #letterSpacingW = 1;

  static #defaultCharSpriteSize = xy_(3, 5);

  static #spriteSheetCells: Record<string, Xy> = {
    // TODO: externalize these emojis to constants for an easier re-use
    ["⬅️"]: xy_(11, 8),
    ["⬆️"]: xy_(4, 9),
    ["➡️"]: xy_(1, 9),
    ["⬇️"]: xy_(3, 8),
    ["♪"]: xy_(13, 8),
    //
    ["0"]: xy_(0, 3),
    ["1"]: xy_(1, 3),
    ["2"]: xy_(2, 3),
    ["3"]: xy_(3, 3),
    ["4"]: xy_(4, 3),
    ["5"]: xy_(5, 3),
    ["6"]: xy_(6, 3),
    ["7"]: xy_(7, 3),
    ["8"]: xy_(8, 3),
    ["9"]: xy_(9, 3),
    //
    ["@"]: xy_(0, 4),
    //
    ["a"]: xy_(1, 6),
    ["b"]: xy_(2, 6),
    ["c"]: xy_(3, 6),
    ["d"]: xy_(4, 6),
    ["e"]: xy_(5, 6),
    ["f"]: xy_(6, 6),
    ["g"]: xy_(7, 6),
    ["h"]: xy_(8, 6),
    ["i"]: xy_(9, 6),
    ["j"]: xy_(10, 6),
    ["k"]: xy_(11, 6),
    ["l"]: xy_(12, 6),
    ["m"]: xy_(13, 6),
    ["n"]: xy_(14, 6),
    ["o"]: xy_(15, 6),
    ["p"]: xy_(0, 7),
    ["q"]: xy_(1, 7),
    ["r"]: xy_(2, 7),
    ["s"]: xy_(3, 7),
    ["t"]: xy_(4, 7),
    ["u"]: xy_(5, 7),
    ["v"]: xy_(6, 7),
    ["w"]: xy_(7, 7),
    ["x"]: xy_(8, 7),
    ["y"]: xy_(9, 7),
    ["z"]: xy_(10, 7),
  };

  static #charSpriteSizes: Record<string, Xy> = {
    // TODO: externalize these emojis to constants for an easier re-use
    ["⬅️"]: xy_(7, 5),
    ["⬆️"]: xy_(7, 5),
    ["➡️"]: xy_(7, 5),
    ["⬇️"]: xy_(7, 5),
    ["♪"]: xy_(7, 5),
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
    let positionInText: Xy = Xy.zero;

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
          xy_(Pico8Font.#defaultCharSpriteSize.x + Pico8Font.#letterSpacingW, 0)
        );
      } else {
        positionInText = positionInText.add(
          xy_(Pico8Font.#defaultCharSpriteSize.x + Pico8Font.#letterSpacingW, 0)
        );
      }
    }

    return charSprites;
  }
}
