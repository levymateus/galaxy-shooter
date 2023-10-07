import { Text } from "ui";
import { Container } from "pixi.js";

export default class Score extends Container {
  private static MASK = "00000000";
  private count: number;
  public text: Text;

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

  public setValue(value: number) {
    this.text.text = this.pad(value, Score.MASK.length);
  }

  public inc(amount: number): number {
    this.count = this.count + amount;
    this.setValue(this.count);
    return this.count;
  }
}

