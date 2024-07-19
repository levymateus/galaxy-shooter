import { uuid } from "utils/uuid"

export const Id = () => {
  return function (target: Object, propertyKey: string) {
    let value: string

    const getter = function () {
      return value
    }

    const setter = function () {
      value = uuid()
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    })
  }
}
