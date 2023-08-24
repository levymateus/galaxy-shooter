import app from './app';
import { queryByType } from './objects';

function circleVsRectTest(circle, rect) {
  const distance = {
    x: Math.abs(circle.x - rect.x),
    y: Math.abs(circle.y - rect.y)
  }

  if (distance.x > (rect.width / 2 + circle.radius)) {
    return false;
  }

  if (distance.y > (rect.height / 2 + circle.radius)) {
    return false;
  }

  if (distance.x <= (rect.width / 2)) {
    return true;
  }

  if (distance.y <= (rect.height / 2)) {
    return true;
  }

  const cornerDistance = Math.pow((distance.x - rect.width / 2), 2) + Math.pow((distance.y - rect.height / 2), 2);

  return (cornerDistance <= Math.pow(circle.radius, 2))
  
}

function circleVsCircle(circleA, circleB) {
  const distX = circleA.x - circleB.x;
  const distY = circleA.y - circleB.y;
  const dist = Math.sqrt((distX * distX) + (distY * distY));
  return (dist <= circleA.radius + circleB.radius) 
}

// Game objects collision
app.ticker.add(() => {
  const rects = queryByType('rect');
  const circles = queryByType('circle');
  
  rects.forEach((rect) => {
    circles.forEach((circle) => {
      const isCollide = circleVsRectTest(circle, rect);
      if (isCollide ) {
        rect.oncollide(circle);
        circle.oncollide(rect);
      }
    });
  });

  circles.forEach((circleA) => {
    circles.forEach((circleB) => {
      if (circleA.id !== circleB.id) {
        const isCollide = circleVsCircle(circleA, circleB);
        if (isCollide) {
          circleA.oncollide(circleB);
          circleB.oncollide(circleA);
        }
      }
    });
  });

});
