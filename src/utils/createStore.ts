
export const createStore =
  <T extends { [key: string]: any }>(
    initialState: T,
    actions?: Partial<Record<keyof T, (state: T) => T>>,
  ) => {

    const handler = {
      set(
        target: { [key: string]: any },
        prop: string,
        receiver: any
      ) {
        if (target[prop] !== undefined) {
          target[prop] = receiver
          return true
        }
        console.warn(
          `The property ${String(prop)} is missing.\n
          Initialize the prop ${String(prop)}!`
        )
        return false
      },
      get(
        target: { [key: string]: any },
        prop: string,
      ) {
        if (target[prop] !== undefined) {
          const callback = actions && actions[prop]
          return callback && callback(target[prop]) || target[prop]
        }
        return undefined
      }
    }

    return new Proxy<typeof initialState>(initialState, handler)
  }
