import { HTMLText, getFontFamilyName } from "pixi.js"

export interface IText {
  text: HTMLText
  setFont(src: string): Promise<void>
}

export interface GUITextFactory<T extends HTMLText> {
  createTextSx(text?: string): Promise<T>
  createTextSm(text?: string): Promise<T>
  createText(text?: string): Promise<T>
  createTextLg(text?: string): Promise<T>
}

class GUIText implements IText {
  text: HTMLText
  async setFont(src: string): Promise<void> {
    try {
      this.text.style.fontFamily = getFontFamilyName(src)
      return await this.text.style.loadFont(src)
    } catch {
      if (process.env.NODE_ENV !== "production")
        throw new Error(`Error on setFont: Fail to load ${src}.`)
      return
    }
  }
}

/**
 * Decorator for `Text`.
 * Create a styled extra small styled text.
 */
export class SxText extends GUIText implements IText {
  text: HTMLText
  constructor(htmlText: HTMLText) {
    super()
    this.text = htmlText
    this.text.style.fill = "white"
    this.text.style.fontSize = 13
    this.text.style.dropShadowColor = "blue"
    this.text.style.dropShadowBlur = 0
    this.text.style.dropShadowDistance = 5
    this.text.style.dropShadow = false
  }
}

/**
 * Decorator for `Text`.
 * Create a styled small styled text.
 */
export class SmText extends GUIText implements IText {
  text: HTMLText
  constructor(htmlText: HTMLText) {
    super()
    this.text = htmlText
    this.text.style.fill = "white"
    this.text.style.fontSize = 16
    this.text.style.dropShadowColor = "blue"
    this.text.style.dropShadowBlur = 0
    this.text.style.dropShadowDistance = 5
    this.text.style.dropShadow = false
  }
}

/**
 * Decorator for `Text`.
 * Create a styled normal styled text.
 */
export class MdText extends GUIText implements IText {
  text: HTMLText
  constructor(htmlText: HTMLText) {
    super()
    this.text = htmlText
    this.text.style.fill = "white"
    this.text.style.fontSize = 21
    this.text.style.dropShadowColor = "blue"
    this.text.style.dropShadowBlur = 0
    this.text.style.dropShadowDistance = 5
    this.text.style.dropShadow = true
  }
}

/**
 * Decorator for `Text`.
 * Create a styled large styled text.
 */
export class LgText extends GUIText implements IText {
  text: HTMLText
  constructor(htmlText: HTMLText) {
    super()
    this.text = htmlText
    this.text.style.fill = "white"
    this.text.style.fontSize = 24
    this.text.style.dropShadowColor = "blue"
    this.text.style.dropShadowBlur = 0
    this.text.style.dropShadowDistance = 5
    this.text.style.dropShadow = true
  }
}

export class TextFactory implements GUITextFactory<HTMLText> {
  async createTextSx(text?: string): Promise<HTMLText> {
    const txt = new HTMLText(text)
    await new SxText(txt).setFont("assets/fonts/PixeloidSansBold.ttf")
    txt.style.fontWeight = "normal"
    return txt
  }

  async createTextSm(text?: string): Promise<HTMLText> {
    const txt = new HTMLText(text)
    await new SmText(txt).setFont("assets/fonts/PixeloidSansBold.ttf")
    txt.style.fontWeight = "normal"
    return txt
  }

  async createText(text?: string): Promise<HTMLText> {
    const txt = new HTMLText(text)
    await new MdText(txt).setFont("assets/fonts/PixeloidSansBold.ttf")
    txt.style.fontWeight = "bold"
    return txt
  }

  async createTextLg(text?: string): Promise<HTMLText> {
    const txt = new HTMLText(text)
    await new LgText(txt).setFont("assets/fonts/PixeloidSansBold.ttf")
    txt.style.fontWeight = "bold"
    return txt
  }
}
