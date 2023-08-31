
export function timeout(arg, callback) {
  let timeoutId = null
  const props = {
    done: true,
    start: null,
    stop: null,
  };

  props.start = function (timeout) {
    props.done = false;
    timeoutId = window.setTimeout(() => {
      props.done = true;
      if (callback) callback();
    }, timeout || arg);
  };

  props.stop = function () {
    window.clearTimeout(timeoutId);
  };

  return props;
}

export const countdown = timeout;

export function interval(t, callback) {
  let intervalId = null
  const props = {
    start() {
      intervalId = window.setInterval(callback, t);
    },
    stop() {
      window.clearInterval(intervalId);
    }
  }

  return props;
}
