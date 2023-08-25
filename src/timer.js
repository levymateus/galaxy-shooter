import app from "./app";

function tick(cd, callback) {
  let countdown = cd;
  let ticker = null;

  const props = {
    done: true,
    start: null,
  }

  function count(dt) {
    countdown -= dt;
    console.log(countdown);
    if (countdown <= 0) {
      if (!!callback && !props.done) {
        app.ticker.remove(ticker);
        ticker = null;
        callback();
      }
      props.done = true;
    }
  }

  props.start = (argCd) => {
    props.done = false;
    countdown = argCd || cd;
    if (!ticker) {
      ticker = app.ticker.add(count);
    }
  }

  return props;
}

export function timeout(t, callback) {
  return tick(t, callback);
}

export function countdown(t, callback) {
  return tick(t, callback);
}
