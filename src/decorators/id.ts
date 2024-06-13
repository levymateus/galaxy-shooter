
export const Id = () => {
  return function (target: Object, propertyKey: string) {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    const uuid = () => s4()
      + s4()
      + '-'
      + s4()
      + '-'
      + s4()
      + '-'
      + s4()
      + '-'
      + s4()
      + s4()
      + s4()

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
