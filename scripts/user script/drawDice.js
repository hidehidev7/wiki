'use strict'

const elm = document.querySelector(".usercode");
const canvas = document.createElement("canvas");
elm.appendChild(canvas)
const ctx = canvas.getContext("2d");

const UPDATE_LOAD_COEFF = 0.5;
let targetInterval = 1000 / 60;
let prevTime = Date.now() - targetInterval;

const canvasSize = [80, 80];
let center = {x:0, y:0};
let diceSpot = 0;
let diceSize = 0;
let diceA = 0;
let diceRealAngle = 0;
let angle = 0;
let realAngle = 0;
let roll = 5;
let tick=0;


function drawDice() {
  ctx.fillStyle = "#ffffff";
   ctx.strokeStyle = "#cfcfcf";
   ctx.lineWidth = diceSpot *1.5;
   ctx.lineJoin = "round";
   ctx.save();
   ctx.translate(center.x, center.y);
   ctx.rotate(diceRealAngle);
   ctx.translate(-center.x, -center.y);
   
   ctx.rect(center.x - diceSize/2, center.y - diceSize/2, diceSize, diceSize);
   ctx.fill();
   ctx.stroke();
   ctx.beginPath();
   switch (roll) {
       case 1:
           ctx.arc(center.x + diceSpot*(0/2.2), center.y + diceSpot*(0/2.2), diceSpot, 0, Math.PI*2, false);
           break;
   
       case 2:
           ctx.arc(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2));
           ctx.arc(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2), diceSpot, 0, Math.PI*2, false);
           
           break;
   
       case 3:
           ctx.arc(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(0/2.2), center.y + diceSpot*(0/2.2));
           ctx.arc(center.x + diceSpot*(0/2.2), center.y + diceSpot*(0/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2));
           ctx.arc(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2), diceSpot, 0, Math.PI*2, false);
           break;
   
       case 4:
           ctx.arc(center.x + diceSpot*(4/2.2), center.y + diceSpot*(4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(4/2.2));
           ctx.arc(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2));
           ctx.arc(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(-4/2.2));
           ctx.arc(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(-4/2.2), diceSpot, 0, Math.PI*2, false);
           
           break;
   
       case 5:
           ctx.arc(center.x + diceSpot*(4/2.2), center.y + diceSpot*(4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(4/2.2));
           ctx.arc(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(0/2.2), center.y + diceSpot*(0/2.2));
           ctx.arc(center.x + diceSpot*(0/2.2), center.y + diceSpot*(0/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2));
           ctx.arc(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(-4/2.2));
           ctx.arc(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(-4/2.2), diceSpot, 0, Math.PI*2, false);
           break;
   
       case 6:
           ctx.arc(center.x + diceSpot*(4/2.2), center.y + diceSpot*(4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.arc(center.x + diceSpot*(0/2.2), center.y + diceSpot*(4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.arc(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.moveTo(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2));
           ctx.arc(center.x + diceSpot*(4/2.2), center.y + diceSpot*(-4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.arc(center.x + diceSpot*(0/2.2), center.y + diceSpot*(-4/2.2), diceSpot, 0, Math.PI*2, false);
           ctx.arc(center.x + diceSpot*(-4/2.2), center.y + diceSpot*(-4/2.2), diceSpot, 0, Math.PI*2, false);
           break;

      default:
           break;
   }
   ctx.closePath();
   ctx.fillStyle = "#777777";
   ctx.fill();
   ctx.restore();
}
function mainUpdate() {
  canvas.width = canvasSize[0] * window.devicePixelRatio;
   canvas.height = canvasSize[1] * window.devicePixelRatio;
   canvas.style.width = canvasSize[0] + "px";
   canvas.style.height = canvasSize[1] + "px";
   center = {x:canvas.width / 2, y:canvas.height / 2};
   diceSpot = 4.4 * window.devicePixelRatio;
   diceSize = diceSpot*(4/2.2)*5;
   if(tick>44) {
       let tmp = roll;
       roll=Math.floor(Math.random()*6+1);
       if(tmp!==roll) {
           angle-=Math.PI*2;
       }
       tick=0;
   }
   realAngle+=(angle-realAngle)*0.2;
   diceA+=Math.PI/480;
   diceRealAngle=diceA+realAngle%(Math.PI*2);
   tick++;
}
function mainDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
   drawDice();
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
mainloop();
