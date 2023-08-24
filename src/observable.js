

// TODO: https://pixijs.download/v6.1.1/docs/PIXI.Signal.html

export function create(value) {
  const observable = {
    value: value,
    listeners: [],
    set: function(val) {
      this.notify(this.value, val);
      this.value = val;
    },
    listen: function(callback) {
      this.listeners.push(callback);
      this.notify(this.value, this.value);
    },
    notify: function (prev, curr) {
      this.listeners.forEach((callback) => {
        callback(prev, curr);
      });
    }
  };
  
  observable.set.bind(observable);
  observable.listen.bind(observable);
  observable.notify.bind(observable);

  return observable;
}

