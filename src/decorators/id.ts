export const Id = () => {
  return function (target: Object, propertyKey: string) {
    let value: string

    const getter = function () {
      return value
    }

    const setter = function () {
      value = crypto.randomUUID()
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    })
  }
}
