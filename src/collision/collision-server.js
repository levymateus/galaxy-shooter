import app from "../app";

let circles = null;

function circleVsCircle(circleA, circleB) {
  const distX = circleA.x - circleB.x;
  const distY = circleA.y - circleB.y;
  const distZ = circleA.z - circleB.z;
  const dist = Math.sqrt((distX * distX) + (distY * distY) + (distZ * distZ));
  return (dist <= circleA.body.shape.radius + circleB.body.shape.radius)
}

export const create = () => {

  const props = {
    start: null,
    register: null,
    update: null,
    remove: null,
  };

  props.start = function() {
    if (!circles) {
      circles = new Set();
    }
  }

  props.update = function() {
    circles.forEach((circleA) => {
      circles.forEach((circleB) => {
        if (circleA.body.id !== circleB.body.id) {
          const isCollide = circleVsCircle(circleA, circleB);
          if (isCollide && circleA.z === circleB.z) {
            circleA.oncollide(circleB);
            circleB.oncollide(circleA);
          }
        }
      });
    });
  }

  props.register = function(ref) {
    if (circles && !circles.has(ref)) {

      if (ref.body.shape.type === 'Circle') {
        circles.add(ref);
      }

    }
  }

  props.remove = function(ref) {
    if (circles && circles.has(ref)) {
      circles.delete(ref);
    }
  }

  props.start();
  app.ticker.add(props.update);

  return props;

}

export const get = create;
