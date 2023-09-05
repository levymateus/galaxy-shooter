import settingsJson from '../settings.json';

type KeyboardSettings = {
  MoveUp: string
  MoveDown: string
  MoveLeft: string
  MoveRight: string
}

export default class Settings {

  private config: Record<'Keyboard' | string, KeyboardSettings | unknown>;

  constructor() {
    this.config = settingsJson;
  }

  public getKeyboardSettings(): KeyboardSettings {
    return this.config.Keyboard as KeyboardSettings;
  }
}
