"use strict";

const elm = document.querySelector(".canvas");
const canvas = document.createElement("canvas");
elm.appendChild(canvas)
const ctx = canvas.getContext("2d");
 
const canvasSize = [500, 100];
let wingX = undefined;
let wingA = undefined;
let center = [0,0];
let wingR = 12*window.devicePixelRatio;


function drawWing() {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#cfcfcf";
    ctx.lineWidth = wingR/5;
    ctx.lineJoin = "round";
    ctx.save();
    ctx.beginPath();
    ctx.translate(center[0]+wingX, center[1]);
    ctx.rotate(wingA);
    ctx.translate(-center[0]-wingX, -center[1]);
    ctx.arc(center[0]+wingX, center[1], wingR, -Math.PI/2, Math.PI/2, false);
    ctx.quadraticCurveTo(center[0]+wingX+wingR*(2/3), center[1], center[0]+wingX, center[1]-wingR);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function mainUpdate() {
    canvas.width = canvasSize[0] * window.devicePixelRatio;
    canvas.height = canvasSize[1] * window.devicePixelRatio;
    canvas.style.width = canvasSize[0] + "px";
    canvas.style.height = canvasSize[1] + "px";
    center = [canvas.width/2, canvas.height/2];
    wingR = 10*window.devicePixelRatio;

    wingX = Math.sin(Math.PI*(Date.now()/625))*200*window.devicePixelRatio;
    wingA = (Math.PI*Date.now()/300)%(Math.PI*2);
}

function mainDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWing();
}

function mainloop() {
    mainUpdate();
    mainDraw();
    requestAnimationFrame(mainloop);
}

mainloop();
