import "styles.css";

import { Game } from "core";
import manifest from "res/manifest.json";
import MainScene from "scenes/MainScene";

const game = new Game(window, document.body, { manifest });
game.gotoScene(new MainScene(game));
