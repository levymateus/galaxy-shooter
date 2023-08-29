import app from "../app";

let bodies = null;
let circles = [];

function circleVsCircle(circleA, circleB) {
  const distX = circleA.x - circleB.x;
  const distY = circleA.y - circleB.y;
  const dist = Math.sqrt((distX * distX) + (distY * distY));
  return (dist <= circleA.body.shape.radius + circleB.body.shape.radius)
}

export function create(){

  const props = {
    start: null,
    register: null,
    update: null,
  };

  props.start = function() {
    if (!bodies) {
      bodies = new Set();
    }
  }

  props.update = function() {
    circles.forEach((circleA) => {
      circles.forEach((circleB) => {
        if (circleA.body.id !== circleB.body.id) {
          const isCollide = circleVsCircle(circleA, circleB);
          if (isCollide) {
            circleA.oncollide(circleB);
            circleB.oncollide(circleA);
          }
        }
      });
    });
  }

  props.register = function(ref) {
    if (bodies && !bodies.has(ref)) {

      if (ref.body.shape.type === 'Circle') {
        circles.push(ref);
      }

      bodies.add(ref);
    }
  }

  props.start();
  app.ticker.add(props.update);

  return props;

}
