var container = document.createElement("div");
var timerMax = 1000;
var timerInterval = 300;
container.style.cssText =
  "position:fixed;top:0;left:0;cursor:pointer;opacity:0.8;z-index:100000";
// container.addEventListener("click", function (event) {
//   event.preventDefault();
  
// });



var timer = new Panel("#0ff", "#002");
var memory = new Panel("#0f0", "#020");
container.appendChild(timer.dom);
container.appendChild(memory.dom);
document.body.appendChild(container);

var prevTime = (performance || Date).now();
setInterval(function () {
  var time = (performance || Date).now();
  timer.update(time - prevTime, timerMax);
  prevTime = time;

  memory.update(
    performance.memory.usedJSHeapSize / 1048576,
    performance.memory.jsHeapSizeLimit / 1048576
  );
}, timerInterval);

function Panel(foreColor, bgColor) {
  var min = Infinity,
    max = 0,
    round = Math.round;
  var PR = round(window.devicePixelRatio || 1);

  var WIDTH = 80 * PR,
    HEIGHT = 48 * PR,
    TEXT_X = 3 * PR,
    TEXT_Y = 8 * PR,
    GRAPH_X = 3 * PR,
    GRAPH_Y = 15 * PR,
    GRAPH_WIDTH = 74 * PR,
    GRAPH_HEIGHT = 30 * PR;

  var canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.style.cssText = "width:80px;height:48px";

  var context = canvas.getContext("2d");
  context.font = 10 * PR + "px Arial";

  context.fillStyle = bgColor;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.fillStyle = foreColor;

  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  context.fillStyle = bgColor;
  context.globalAlpha = 0.9;
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  return {
    dom: canvas,

    update: function (value, maxValue) {
      min = Math.min(min, value);
      max = Math.max(max, value);

      context.fillStyle = bgColor;
      context.globalAlpha = 1;
      context.fillRect(0, 0, WIDTH, GRAPH_Y);
      context.fillStyle = foreColor;
      context.fillText(
        round(value) + "(" + round(min) + "-" + round(max) + ")",
        TEXT_X,
        TEXT_Y
      );

      context.drawImage(
        canvas,
        GRAPH_X + PR,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT,
        GRAPH_X,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT
      );

      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

      context.fillStyle = bgColor;
      context.globalAlpha = 0.9;
      context.fillRect(
        GRAPH_X + GRAPH_WIDTH - PR,
        GRAPH_Y,
        PR,
        round((1 - value / maxValue) * GRAPH_HEIGHT)
      );
    },
  };
}
