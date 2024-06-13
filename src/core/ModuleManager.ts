
export class ModuleManager {
  addSingleton<T>(Singleton: any, ...deps: any[]): T {
    const depsInstaces = deps.map((Dep) => {
      if (typeof Dep === 'function') {
        return new Dep()
      }
      return Dep
    })

    return new Singleton(...depsInstaces)
  }
}
