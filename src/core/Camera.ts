import { Container, ObservablePoint, Ticker } from "pixi.js";
import { Game } from "core";

export class Camera extends Container {
  constructor(pivot: ObservablePoint, game: Game) {
    super();
    this.name = "camera";

    const centralize = () => {
      pivot.x -= game.WIDTH / 2;
      pivot.y -= game.HEIGHT / 2;
    }

    window.addEventListener('resize', () => {
      Ticker.shared.remove(centralize);
      Ticker.shared.addOnce(centralize);
    });

    Ticker.shared.addOnce(centralize);
  }
}
