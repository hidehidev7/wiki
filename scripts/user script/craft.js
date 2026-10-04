'use strict'

export function main() {

const elm = document.querySelector(".usercode");
const cvs = document.createElement("canvas");
elm.appendChild(cvs);
const ctx = cvs.getContext("2d");
let x = 360;
let y = 500;
let isCrafted = 0;
let particlesArray = [];
const numberOfParticles = 100;
let petalsArray = [];
let petalCrafted = 1;
let canPetalSpin = 0;
let mouseX = undefined;
let mouseY = undefined;
let isClicked = false;

const UPDATE_LOAD_COEFF = 0.5;

let targetInterval = 1000 / 180;
let prevTime = Date.now() - targetInterval;

const canvasSize = {
    w: 800*window.devicePixelRatio,
    h: 300*window.devicePixelRatio
}

class Particle {
  constructor(size, vx, vy, va) {
       this.size = size;
       this.vx = vx;
       this.vy = vy;
       this.va = va;
       this.x = x;
       this.y = y;
       this.a = 0;
       this.alpha = 1;
       this.wait = 3;
   }
   update() {
       this.wait -= 1;
       if (this.wait < 0) {
           this.vy -= 0.02;
           this.vx *= 0.975;
           this.vy *= 0.975;
           this.x += this.vx;
           this.y -= this.vy;
           this.a += this.va;
           this.alpha -= 0.01;
       }
   }
   draw() {
       if (this.wait < 0) {
           ctx.save();
           ctx.translate(this.x, this.y);
           ctx.rotate((Math.PI / 180) * this.a);
           ctx.translate(-this.x, -this.y);
           ctx.fillStyle = `rgba(34, 218, 221, ${this.alpha})`;
           ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
           ctx.restore()
       }
   }
}
class Petal {
  constructor(angle) {
       this.size = 1;
       this.angle = angle;
       this.alpha = 1;
       this.phase = 0.5;
       this.ease = 0;
       this.radius = 100 + Math.cos(this.phase) * 42;
   }
   update() {
       if (canPetalSpin == 1) {
           this.angle += (Math.PI * 3) / 180 * (this.ease / 0.06);
           if (this.ease < 0.06) {
               this.ease += 0.001;
           }
           this.phase += this.ease;
           this.radius = 100 + Math.cos(this.phase) * 42;
           if (this.phase > 51.8) {
               this.alpha -= 0.05;
               this.size -= 0.05;
               this.radius -= 0.2;
               if (isCrafted == 0) {
                   petalCrafted = new PetalCrafted();
                   isCrafted = 1;
               }
           }
       }
   }
   draw() {
       if (this.size > 0) {
           ctx.fillStyle = ctx.fillStyle = `rgba(222, 31, 31, ${this.alpha})`;
           ctx.fillRect(x + this.radius * Math.cos(this.angle) - 38 * this.size, y + this.radius * Math.sin(this.angle) - 38 * this.size, 76 * this.size, 76 * this.size);

          ctx.strokeStyle = `rgba(180, 25, 25, ${this.alpha})`;
           ctx.lineWidth = 6 * this.size;
           ctx.beginPath();
           ctx.roundRect(x + this.radius * Math.cos(this.angle) - 38 * this.size, y + this.radius * Math.sin(this.angle) - 38 * this.size, 76 * this.size, 76 * this.size, 1 * this.size);
           ctx.stroke();

          ctx.beginPath();
           ctx.arc(x + this.radius * Math.cos(this.angle), y + this.radius * Math.sin(this.angle) - 6 * this.size, 14 * this.size, 0, Math.PI * 2);
           ctx.fillStyle = `rgba(207, 207, 207, ${this.alpha})`;
           ctx.fill();
           ctx.closePath();

          ctx.beginPath();
           ctx.arc(x + this.radius * Math.cos(this.angle), y + this.radius * Math.sin(this.angle) - 6 * this.size, 10 * this.size, 0, Math.PI * 2);
           ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
           ctx.fill();
           ctx.closePath();

          ctx.strokeStyle = `rgba(34, 34, 34, ${this.alpha})`;
           ctx.font = `bold ${16 * this.size}px Ubuntu, sans-serif`;
           ctx.textAlign = "center";
           ctx.textBaseline = 'middle';
           ctx.lineWidth = 2 * this.size;
           ctx.lineJoin = 'round';
           ctx.strokeText("Basic", x + this.radius * Math.cos(this.angle), y + this.radius * Math.sin(this.angle) + 20 * this.size);
           ctx.fillStyle = `rgba(238, 238, 238, ${this.alpha})`;
           ctx.font = `bold ${16 * this.size}px Ubuntu, sans-serif`;
           ctx.fillText("Basic", x + this.radius * Math.cos(this.angle), y + this.radius * Math.sin(this.angle) + 20 * this.size);
       } else {
           pop();
           petalsArray.splice(0);
       }
   }
}
class PetalCrafted {
  constructor() {
       this.size = 0.05;
       this.vsize = 0.21;
       this.alpha = 0;
       this.angle = Math.PI;
       this.times = 1;
   }

  update() {
       if (this.times < 36) {
           this.alpha += 0.05;
           this.size += this.vsize;
           this.vsize -= 0.01;
           this.times += 1;
       }
       this.angle *= 0.9;
   }

  draw() {
       ctx.save();
       ctx.translate(x, y);
       ctx.rotate(this.angle);
       ctx.translate(-x, -y);
       ctx.fillStyle = ctx.fillStyle = `rgba(31, 219, 222, ${this.alpha})`;
       ctx.fillRect(x - 38 * this.size, y - 38 * this.size, 76 * this.size, 76 * this.size);

      ctx.strokeStyle = `rgba(25, 177, 180, ${this.alpha})`;
       ctx.lineWidth = 6 * this.size;
       ctx.beginPath();
       ctx.roundRect(x - 38 * this.size, y - 38 * this.size, 76 * this.size, 76 * this.size, 1 * this.size);
       ctx.stroke();

      ctx.beginPath();
       ctx.arc(x, y - 6 * this.size, 14 * this.size, 0, Math.PI * 2);
       ctx.fillStyle = `rgba(207, 207, 207, ${this.alpha})`;
       ctx.fill();
       ctx.closePath();

      ctx.beginPath();
       ctx.arc(x, y - 6 * this.size, 10 * this.size, 0, Math.PI * 2);
       ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
       ctx.fill();
       ctx.closePath();

      ctx.strokeStyle = `rgba(34, 34, 34, ${this.alpha})`;
       ctx.font = `bold ${16 * this.size}px Ubuntu, sans-serif`;
       ctx.textAlign = "center";
       ctx.textBaseline = 'middle';
       ctx.lineWidth = 2 * this.size;
       ctx.lineJoin = 'round';
       ctx.strokeText("Basic", x, y + 20 * this.size);
       ctx.fillStyle = `rgba(238, 238, 238, ${this.alpha})`;
       ctx.font = `bold ${16 * this.size}px Ubuntu, sans-serif`;
       ctx.fillText("Basic", x, y + 20 * this.size);
       ctx.restore();
   }
}

cvs.addEventListener("click", (event) => {
  mouseX = (event.clientX - cvs.getBoundingClientRect().x) * devicePixelRatio;
   mouseY = (event.clientY - cvs.getBoundingClientRect().y) * devicePixelRatio;
   isClicked = true;
});

cvs.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - cvs.getBoundingClientRect().x) * devicePixelRatio;
   mouseY = (event.clientY - cvs.getBoundingClientRect().y) * devicePixelRatio;
});


function pop() {
  for (let i = 0; i < numberOfParticles; i++) {
       particlesArray.push(new Particle(
           (Math.random() * 4 + 1) * window.devicePixelRatio,
           (Math.random() * 6 - 3) * window.devicePixelRatio,
           (Math.random() * 4 - 1) * window.devicePixelRatio,
           Math.random() * 8 - 4
       ))
   }
}
function setPetals() {
  for (let i = 0; i < 5; i++) {
       petalsArray.push(new Petal(Math.PI * (2 / 5) * i));
   }
}
window.onresize = function () {
  resize();
}
function resize() {
    canvas.width = canvasSize.w * window.devicePixelRatio;
    canvas.height = canvasSize.h * window.devicePixelRatio;
    canvas.style.width = canvasSize.w + "px";
    canvas.style.height = canvasSize.h + "px";
    y = cvs.height / 2;
}
function drawbtn(x, y, w, h) {
  ctx.fillStyle = 'rgba(31, 219, 222, 1)';
   ctx.fillRect(x - w / 2, y - h / 2, w, h);
   if (
       mouseX >= x - w / 2 &&
       mouseX <= x + w / 2 &&
       mouseY >= y - h / 2 &&
       mouseY <= y + h / 2
   ) {
       ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
       ctx.fillRect(x - w / 2, y - h / 2, w, h);
       cvs.style.cursor = "pointer";
       if (isClicked) {
           canPetalSpin = 1;
       }
   } else {
       cvs.style.cursor = "default"
   }

  ctx.strokeStyle = 'rgba(25, 177, 180, 1)';
   ctx.lineWidth = 6;
   ctx.beginPath();
   ctx.roundRect(x - w / 2, y - h / 2, w, h, 8);
   ctx.stroke();

  ctx.textAlign = "center";
   ctx.textBaseline = 'middle';
   ctx.strokeStyle = '#222222';
   ctx.font = 'bold 20px Ubuntu, sans-serif';
   ctx.lineWidth = 4;
   ctx.lineJoin = 'round';
   ctx.strokeText("Craft", x, y);
   ctx.fillStyle = '#EEEEEE';
   ctx.font = 'bold 20px Ubuntu, sans-serif';
   ctx.fillText("Craft", x, y);
}

function mainUpdate() {
  resize();
   // particle
   for (let i = 0; i < particlesArray.length; i++) {
       particlesArray[i].update();
       if (particlesArray[i].alpha < 0) {
           particlesArray.splice(i, 1);
       }
   }

  // petal
   for (let i = 0; i < petalsArray.length; i++) {
       petalsArray[i].update();
   }

  if (isCrafted == 1) {
       petalCrafted.update();
   }
}
function mainDraw() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
   ctx.fillStyle = "#DB9D5A";
   ctx.fillRect(0, 0, cvs.width, cvs.height);

  drawbtn(x+360, y, 84, 42);
   // particle
   for (let i = 0; i < particlesArray.length; i++) {
       particlesArray[i].draw();
   }

  // petal
   for (let i = 0; i < petalsArray.length; i++) {
       petalsArray[i].draw();
   }

  if (isCrafted == 1) {
       petalCrafted.draw();
   }
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
           // overloaded
           if (prevTime < now - targetInterval) {
               // do not accumulate too much
               prevTime = now - targetInterval;
           }
           break;
       }
   }
   if (updated) {
       mainDraw();
   }

  if (isClicked) {
       isClicked = false;
   }
   requestAnimationFrame(mainloop);
} setPetals();
mainloop();

}