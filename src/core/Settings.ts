import { Resolution } from "core";

/**
 * Global game settings parser.
 */
class SettingsClass {

  resolutions: [Resolution, Resolution, Resolution] = [
    { w: 640, h: 360, ratio: [16, 9] },
    { w: 960, h: 540, ratio: [16, 9] },
    { w: 549, h: 540, ratio: [1, 1] },
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
