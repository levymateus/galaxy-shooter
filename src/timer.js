<<<<<<< Updated upstream
export default class Timer {
  static countdown(count, callback, complete) {
    let countdown = count;
    let intervalId = null;
    callback && callback(countdown);
    intervalId = setInterval(() => {
      countdown -= 1;
      if (countdown > 0) {
        callback && callback(countdown);
      } else {
        clearInterval(intervalId);
        complete();
      }
    }, 1000);
  }
=======

export function timeout(callback, ms) {
  const props = {
    timedout: false,
    id: null,
  }

  window.setTimeout(function () {
    props.timedout = true;
    callback();
  }, ms),

  props.stop = function() {
    window.clearTimeout(props.id);
  }
  
  return props;
>>>>>>> Stashed changes
}
