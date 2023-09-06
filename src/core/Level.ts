import { GameObject } from "core/GameObject";
import { App } from "./App";
import { Container } from "pixi.js";

export default class Level {

  private container: Container;
  private player: GameObject;
  private enemies: GameObject[];

  constructor(name: string) {
    this.container = new Container();
    this.container.name = name;
    this.enemies = [];
  }

  public addPlayer(player: GameObject): Level {
    this.player = player;
    this.container.addChild(this.player.root);
    return this;
  }

  public addEnemy(enemy: GameObject): Level {
    this.enemies.push(enemy);
    enemy.name += '_' + (this.enemies.length).toString();
    this.container.addChild(enemy.root);
    return this;
  }

  public start(): Level {
    App.app.stage.addChild(this.container);
    return this;
  }
}
