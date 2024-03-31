import { BpxFontPico8, BpxGlyph, spr_ } from "@beetpx/beetpx";

export class Pico8Font extends BpxFontPico8 {
  constructor() {
    super();

    this.glyphs = new Map<string, BpxGlyph>([
      ...this.glyphs,
      [
        "⬅",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(7, 5, 88, 64),
          advance: 8,
        },
      ],
      [
        "➡",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(7, 5, 8, 72),
          advance: 8,
        },
      ],
      [
        "⬆",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(7, 5, 32, 72),
          advance: 8,
        },
      ],
      [
        "⬇",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(7, 5, 24, 64),
          advance: 8,
        },
      ],
      [
        "♪",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(7, 5, 104, 64),
          advance: 8,
        },
      ],
    ]);
  }
}
