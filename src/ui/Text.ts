import { HTMLText, TextStyleFontWeight, getFontFamilyName } from "pixi.js";

/**
 * Pre-configured and styled text for the Space Shooter Game.
 */
export class Text extends HTMLText {
  static PIXELOID_MONO = "assets/fonts/PixeloidMono.ttf";
  static PIXELOID_SANS_BOLD = "assets/fonts/PixeloidSansBold.ttf";
  src: string;

  constructor(text?: string, src?: string) {
    super(text);
    this.style.fill = 0xffffff;
    this.style.fontSize = "12px";
    this.src = src || Text.PIXELOID_MONO;
    this.weight("normal");
  }

  async weight(weight: TextStyleFontWeight) {
    switch (weight) {
      case "bold":
        this.src = Text.PIXELOID_SANS_BOLD;
      case "normal":
      default:
        this.src = Text.PIXELOID_MONO;
    }
    this.style.fontWeight = weight;
    this.style.fontFamily = getFontFamilyName(this.src);
    return await this.style.loadFont(this.src);
  }
}
