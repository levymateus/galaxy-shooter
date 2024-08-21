export const createStore = <T>(initialState: T) => {
  const store = {
    value: initialState,
    set(value: T) {
      this.value = value
    }
  }

  store.set.bind(store)

  return store
}
