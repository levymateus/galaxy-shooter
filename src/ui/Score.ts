import { Container } from "pixi.js";
import { Text } from "ui";

export default class Score extends Container {
  private static MASK = "00000000";
  private count: number;
  text: Text;

  constructor() {
    super();
    this.count = 0;
    this.text = new Text(Score.MASK);
    this.text.weight("bold");
    this.addChild(this.text);
  }

  private pad(value: number, size: number) {
    const strValue: string = Score.MASK + value;
    return strValue.substring(strValue.length - size);
  }

  setValue(value: number) {
    this.text.text = this.pad(value, Score.MASK.length);
  }

  inc(amount: number): number {
    this.count = this.count + amount;
    this.setValue(this.count);
    return this.count;
  }
}

