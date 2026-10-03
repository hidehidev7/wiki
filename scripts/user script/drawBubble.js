'use strict'

const elm = document.querySelector(".usercode");
const canvas = document.createElement("canvas");
elm.appendChild(canvas);
const ctx = canvas.getContext("2d");

const UPDATE_LOAD_COEFF = 0.5;
let targetInterval = 1000 / 60;
let prevTime = Date.now() - targetInterval;

const canvasSize = [210, 210];
let center = { x: 0, y: 0 };
let eye = { x: 0, y: 0 };
let angle = 0;
const reload = [
  [1 * 60, 0.7 * 60],
   [0.875 * 60, 0.6 * 60],
   [0.75 * 60, 0.5 * 60],
   [0.625 * 60, 0.4 * 60],
   [0.5 * 60, 0.3 * 60],
   [0.375 * 60, 0.2 * 60],
   [0.25 * 60, 0.1 * 60],
   [0.125 * 60, 0.1 * 60]
];
let bubble = [];

window.onload = function () {
  document.body.addEventListener("mousemove", (e) => {
       angle = Math.atan2((e.pageX - window.pageXOffset - canvas.getBoundingClientRect().x) * window.devicePixelRatio - center.x, -((e.pageY - window.pageYOffset - canvas.getBoundingClientRect().y) * window.devicePixelRatio - center.y));
   });
} class Bubble {
  constructor(angle, reload, lifeTime) {
       this.size = 0;
       this.alpha = 1;
       this.pop = 1;
       this.tick = 0;
       this.reload = reload;
       this.lifeTime = lifeTime;
       this.angle = angle;
       this.range = 0;
       this.vRange = 10;
   }
   update() {
       this.size = 1 * window.devicePixelRatio;
       this.alpha = 0;
       if (this.tick < this.lifeTime) this.alpha = 1;
       if (this.tick >= this.lifeTime && this.tick < this.lifeTime + 9) {
           this.pop *= 1.06;
           this.size = this.pop * window.devicePixelRatio;
           this.alpha = (2 - (this.pop) * 1.16);
           if (this.alpha < 0) this.alpha = 0;
       }
       this.tick++;
       this.vRange += (55 - this.range) * 0.06;
       this.vRange *= 0.8;
       this.range += this.vRange;
   }
   draw() {
       ctx.lineWidth = this.size * 3;
       ctx.lineJoin = "round";
       ctx.save();
       ctx.beginPath();
       ctx.arc(center.x + this.range * window.devicePixelRatio * Math.cos(this.angle), center.y + this.range * window.devicePixelRatio * Math.sin(this.angle), this.size * 12, 0, Math.PI * 2, false);
       ctx.closePath();
       ctx.globalAlpha = 0.7 * this.alpha;
       ctx.strokeStyle = "#ffffff";
       ctx.stroke();
       ctx.beginPath();
       ctx.arc(center.x + this.range * window.devicePixelRatio * Math.cos(this.angle), center.y + this.range * window.devicePixelRatio * Math.sin(this.angle), this.size * 10.5, 0, Math.PI * 2, false);
       ctx.closePath();
       ctx.globalAlpha = 0.35 * this.alpha;
       ctx.fillStyle = "#ffffff";
       ctx.fill();
       ctx.beginPath();
       ctx.arc(center.x + this.range * window.devicePixelRatio * Math.cos(this.angle) + this.size * 4, center.y + this.range * window.devicePixelRatio * Math.sin(this.angle) - this.size * 4, this.size * 3, 0, Math.PI * 2, false);
       ctx.closePath();
       ctx.fill();
       ctx.restore();
   }
}
function s(num) {
  return window.devicePixelRatio * num;
}
function drawFlower() {
  ctx.lineCap = "round";
   ctx.lineWidth = s(1.4);
   ctx.beginPath();
   ctx.arc(center.x, center.y, s(26.5), 0, Math.PI * 2, false);
   ctx.fillStyle = "#CFBB50";
   ctx.closePath();
   ctx.fill();
   ctx.beginPath();
   ctx.arc(center.x, center.y, s(23.5), 0, Math.PI * 2, false);
   ctx.fillStyle = "#FFE763";
   ctx.closePath();
   ctx.fill();
   ctx.beginPath();
   ctx.moveTo(center.x - s(6), center.y + s(10));
   ctx.quadraticCurveTo(center.x, center.y + s(10 - 4.5), center.x + s(6), center.y + s(10));
   ctx.strokeStyle = "#000";
   ctx.fillStyle = "#000";
   ctx.stroke();
   ctx.beginPath();
   ctx.ellipse(center.x + s(7), center.y - s(4.8), s(3.2), s(6.5), 0, 0, Math.PI * 2, false);
   ctx.ellipse(center.x - s(7), center.y - s(4.8), s(3.2), s(6.5), 0, 0, Math.PI * 2, false);
   ctx.fill();
   ctx.clip();
   ctx.beginPath();
   ctx.fillStyle = "#fff";
   ctx.arc(center.x + s(7) + eye.x, center.y + eye.y - s(4.8), s(3), 0, Math.PI * 2, false);
   ctx.arc(center.x - s(7) + eye.x, center.y + eye.y - s(4.8), s(3), 0, Math.PI * 2, false);
   ctx.fill();
   ctx.lineWidth = s(1);
   ctx.beginPath();
   ctx.ellipse(center.x + s(7), center.y - s(4.8), s(3.2), s(6.5), 0, 0, Math.PI * 2, false);
   ctx.stroke();
   ctx.beginPath();
   ctx.ellipse(center.x - s(7), center.y - s(4.8), s(3.2), s(6.5), 0, 0, Math.PI * 2, false);
   ctx.stroke();
}
function mainUpdate() {
  canvas.width = canvasSize[0] * window.devicePixelRatio;
   canvas.height = canvasSize[1] * window.devicePixelRatio;
   canvas.style.width = canvasSize[0] + "px";
   canvas.style.height = canvasSize[1] + "px";
   center = { x: canvas.width / 2, y: canvas.height / 2 };
   eye = {
       x: eye.x += (Math.sin(angle) * s(2) - eye.x) / 5,
       y: eye.y += (Math.cos(angle) * s(-4.4) - eye.y) / 5
   }
   for (let i = 0; i < bubble.length; i++) {
       bubble[i].update();
       if (bubble[i].tick > bubble[i].reload + bubble[i].lifeTime) {
           bubble.push(new Bubble(bubble[i].angle, bubble[i].reload, bubble[i].lifeTime));
           bubble.splice(i, 1);
           i--;
       }
   }
}
function mainDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
   for (let i = 0; i < bubble.length; i++) {
       bubble[i].draw();
   }
   drawFlower();
}
function mainloop() {
  let currentTime = Date.now();
   let updated = false;
   while (currentTime - prevTime > targetInterval * 0.5) {
       mainUpdate();
       updated = true;
       prevTime += targetInterval;
       const now = Date.now();
       const updateTime = now - currentTime;
       if (updateTime > targetInterval * UPDATE_LOAD_COEFF) {
           if (prevTime < now - targetInterval) {
               prevTime = now - targetInterval;
           }
           break;
       }
   }
   if (updated) {
       mainDraw();
   }
   requestAnimationFrame(mainloop);
}
for (let i = 0; i < 8; i++) {
  bubble.push(new Bubble((Math.PI / 4) * i, reload[i][0], reload[i][1]));
} mainloop();
