import { Resolution } from "core";

/**
 * Global game settings parser.
 */
class SettingsClass {

  resolutions: [Resolution] = [
    { w: 360, h: 640, ratio: [9, 16] },
  ];

  private static instance: SettingsClass;

  public static getInstance(): SettingsClass {
    if (!SettingsClass.instance) {
      SettingsClass.instance = new SettingsClass();
    }
    return SettingsClass.instance;
  }
}

const Settings = SettingsClass.getInstance();

export { Settings }
