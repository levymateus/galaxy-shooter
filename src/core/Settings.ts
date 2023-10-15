import { Resolution } from "core/typings";

/**
 * Global game settings parser.
 */
export class Settings {
  static RESOLUTIONS: [Resolution] = [
    { width: 360, height: 640, ratio: [9, 16] },
  ];
  private static instance: Settings;

  static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }
    return Settings.instance;
  }

  getDefaultResolution(): Resolution {
    return Settings.RESOLUTIONS[0];
  }
}
