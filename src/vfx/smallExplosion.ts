import { EmitterConfigV3 } from "@pixi/particle-emitter";
import { Assets } from "pixi.js";

const create = (): EmitterConfigV3 => ({
  lifetime: {
    min: 0.5,
    max: 0.5
  },
  frequency: 0.008,
  spawnChance: 1,
  particlesPerWave: 1,
  emitterLifetime: 0.31,
  maxParticles: 12,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  behaviors: [
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            {
              value: 0.8,
              time: 0
            },
            {
              value: 0.1,
              time: 1
            }
          ],
        },
      }
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            {
              value: 1,
              time: 0
            },
            {
              value: 0.3,
              time: 1
            }
          ],
        },
      }
    },
    {
      type: 'moveSpeed',
      config: {
        speed: {
          list: [
            {
              value: 100,
              time: 0
            },
            {
              value: 50,
              time: 1
            }
          ],
          isStepped: false
        },
      }
    },
    {
      type: 'rotationStatic',
      config: {
        min: 0,
        max: 360
      }
    },
    {
      type: 'spawnShape',
      config: {
        type: 'torus',
        data: {
          x: 0,
          y: 0,
          radius: 10
        }
      }
    },
    {
      type: 'textureSingle',
      config: {
        texture: Assets.get("particle_001"),
      }
    }
  ],
});

export default create;
