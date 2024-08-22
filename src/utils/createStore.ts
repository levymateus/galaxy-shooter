export const createStore =
  <K extends string, T>(
    initialState: Record<K, T>,
    actions?: Partial<Record<K, (state: T) => T>>,
  ) => {
    const store = initialState

    const handler = {
      set(
        target: typeof store,
        prop: keyof typeof store,
        receiver: T
      ) {
        if (target[prop] !== undefined) {
          target[prop] = receiver
          return true
        }
        console.warn(
          `The property ${prop} is missing.\n
          Initialize the prop ${prop}!`
        )
        return false
      },
      get(
        target: typeof store,
        prop: keyof typeof store,
      ) {
        if (target[prop] !== undefined) {
          const callback = actions && actions[prop]
          return callback && callback(target[prop]) || target[prop]
        }
        return undefined
      }
    }

    return new Proxy(store, handler)
  }
