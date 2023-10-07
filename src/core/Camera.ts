import { Surface } from "core/Surface";
import { Container, ObservablePoint, Ticker } from "pixi.js";

export class Camera extends Container {
  constructor(pivot: ObservablePoint, surface: Surface) {
    super();
    this.name = "camera";
    const centralize = () => {
      pivot.x -= surface.width / 2;
      pivot.y -= surface.height / 2;
    }
    window.addEventListener('resize', () => {
      Ticker.shared.remove(centralize);
      Ticker.shared.addOnce(centralize);
    });
    Ticker.shared.addOnce(centralize);
  }
}
