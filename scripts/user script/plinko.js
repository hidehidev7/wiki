"use strict";

export function main() {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const UPDATE_LOAD_COEFF = 0.5;
    let targetInterval = 1000 / 60;
    let prevTime = Date.now() - targetInterval;

    let auto = false;
    let forChip = 0;
    let chipCount = 10000;
    const dupe = [500, 20, 5, 3, 2, 0, 1, 1, 1, 1, 1, 0, 2, 3, 5, 20, 500];
    const slotToCount = [0, 1, 2, 3, 5, 20, 500];
    let count = [0, 0, 0, 0, 0, 0, 0];
    const colorArr = ["#2bffa3", "#ff2b75", "#1fdbde", "#de1f1f", "#861fde", "#4d52e3", "#ffe65d", "#7eef6d", "#7eef6d", "#7eef6d", "#ffe65d", "#4d52e3", "#861fde", "#de1f1f", "#1fdbde", "#ff2b75", "#2bffa3"];

    let mouseX = undefined;
    let mouseY = undefined;
    let isClicked = false;


    const canvasSize = {
        w: 800,
        h: 750
    }

    const tableSize = { //これに合わせた本家の画面はnot全画面のf12で702*631
        x: 610 * 1.1685 * 0.5 * 2 * window.devicePixelRatio,
        y: 562.6 * 1.1685 * 0.5 * 2 * window.devicePixelRatio
    }
    const toriaezu = {
        x: 9 * 0.5 * 2 * window.devicePixelRatio, //111*...
        y: 50 * 0.5 * 2 * window.devicePixelRatio  //581*...
    }


    const gap = {
        x: 36 * 0.9725 * 0.5 * 2 * window.devicePixelRatio,
        y: 24 * 0.9725 * 0.5 * 2 * window.devicePixelRatio
    }

    let chips = [];
    let particlesArray = [];
    const numberOfParticles = 15;

    class Chip {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 0;

            this.vx = 0;
            this.vy = -0.8;
            this.g = 0.07;

            this.angle = 0;
            this.vangle = -0.3;

            this.phase = 0;
        }
        update() {
            this.size += (5.8 * 0.5 * 2 * window.devicePixelRatio - this.size) * 0.16;
            this.x += this.vx * 0.5 * 2 * window.devicePixelRatio;
            this.y += this.vy * 0.5 * 2 * window.devicePixelRatio;
            this.vy += this.g;
            this.g += (0.2 - this.g) * 0.03;
            this.angle += this.vangle;
            if (this.phase === 0) this.vangle *= 0.98;

            if (this.y > toriaezu.y + 99 * 0.5 * 2 * window.devicePixelRatio + gap.y * (this.phase) - 4) {
                this.phase++;
                this.g = 0;
                if (this.phase < 17) this.vy = 0;
                this.vx = 0.555;
                this.vangle = 0.1;
                if (Math.random() > 0.5) {
                    this.vx *= -1;
                    this.vangle *= -1;
                }
            }
        }
        draw() {
            ctx.fillStyle = "#FFE65E";
            ctx.strokeStyle = "#CFBA4B";
            ctx.lineWidth = this.size / 4;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();


            ctx.fillStyle = "#ffffff";
            this.rectWidth = this.size * 0.45;
            this.rectHeight = this.size * 0.22;
            for (let i = 0; i < 6; i++) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI / 3 * i);
                ctx.rotate(this.angle);
                ctx.fillRect(-this.rectWidth / 2, -this.size * 0.97, this.rectWidth, this.rectHeight);
                ctx.restore();
            }

            ctx.fillStyle = "#ffffff";
            this.rectWidth = this.size * 0.15;
            this.rectHeight = this.size * 0.066;
            for (let i = 0; i < 12; i++) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI / 6 * i);
                ctx.rotate(this.angle);
                ctx.fillRect(-this.rectWidth / 2, -this.size * 0.63, this.rectWidth, this.rectHeight);
                ctx.restore();
            }


        }
    }

    class Particle {
        constructor(x, y, size, vx, vy, va, color) {
            this.size = size;
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.va = va;
            this.a = 0;
            this.alpha = 1;
            this.wait = 3;
            this.color = color;
        }
        update() {
            this.wait -= 1;
            if (this.wait < 0) {
                this.vy -= 0.05;
                this.vx *= 0.95;
                this.vy *= 0.95;
                this.x += this.vx * 0.5 * 2 * window.devicePixelRatio;
                this.y -= this.vy * 0.5 * 2 * window.devicePixelRatio;
                this.a += this.va;
                this.alpha -= 0.02;
            }
        }
        draw() {
            if (this.wait < 0) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((Math.PI / 180) * this.a);
                ctx.translate(-this.x, -this.y);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                ctx.restore()
            }
        }
    }

    function pop(x, y) {
        let colorIndex;
        for (let j = 0; j < 18; j++) {
            if (x < toriaezu.x + tableSize.x / 2 - (gap.x + gap.x * 14 * 0.5) + gap.x * j - gap.x / 2) {
                x = toriaezu.x + tableSize.x / 2 - (gap.x + gap.x * 14 * 0.5) + gap.x * (j - 1);
                y = toriaezu.y + 105 * 0.5 * 2 * window.devicePixelRatio + gap.y * 16;
                chipCount += dupe[j - 1];
                count[slotToCount.indexOf(dupe[j - 1])]++;
                colorIndex = j - 1;
                break;
            }
        }

        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle(x, y,
                (Math.random() * 4 + 2) * 0.5 * 2 * window.devicePixelRatio,
                (Math.random() * 4 - 2),
                (Math.random() * 3 - 0),
                Math.random() * 8 - 4,
                colorArr[colorIndex]
            ))
        }
    }

    function text(text, x, y, size, left) {
        const textBorder = 3;
        ctx.textAlign = left ? "left" : "center";
        ctx.strokeStyle = "#222222";
        ctx.font = `bold ${size}px Ubuntu, sans-serif`;
        ctx.lineWidth = textBorder * (size / 24);
        ctx.lineJoin = "round";
        ctx.strokeText(text, x, y);
        ctx.fillStyle = "#eeeeee";
        ctx.font = `bold ${size}px Ubuntu, sans-serif`;
        ctx.fillText(text, x, y);
    }

    function drawText() {
        text(`ギャンブルしたい人は下の再現機で試してx0に当たるリスクをしっかりと理解してから臨むように！`, 5 * 0.5 * 2 * window.devicePixelRatio, 20 * 0.5 * 2 * window.devicePixelRatio, 16 * 0.5 * 2 * window.devicePixelRatio, true);
        text(`Plinko`, toriaezu.x + tableSize.x / 2, toriaezu.y + tableSize.y * 0.061, 28 * 0.5 * 2 * window.devicePixelRatio);
        text(`Chip x${chipCount}`, toriaezu.x + tableSize.x / 2, toriaezu.y + tableSize.y * 0.885, 12 * 2 * window.devicePixelRatio);
        text(`0x: ${count[0]}`, toriaezu.x + tableSize.x / 8, toriaezu.y + tableSize.y * 0.79, 9 * 2 * window.devicePixelRatio, true);
        text(`1x: ${count[1]}`, toriaezu.x + tableSize.x / 8, toriaezu.y + tableSize.y * 0.82, 9 * 2 * window.devicePixelRatio, true);
        text(`2x: ${count[2]}`, toriaezu.x + tableSize.x / 8, toriaezu.y + tableSize.y * 0.85, 9 * 2 * window.devicePixelRatio, true);
        text(`3x: ${count[3]}`, toriaezu.x + tableSize.x / 8, toriaezu.y + tableSize.y * 0.88, 9 * 2 * window.devicePixelRatio, true);
        text(`5x: ${count[4]}`, toriaezu.x + tableSize.x / 8, toriaezu.y + tableSize.y * 0.91, 9 * 2 * window.devicePixelRatio, true);
        text(`20x: ${count[5]}`, toriaezu.x + tableSize.x / 8, toriaezu.y + tableSize.y * 0.94, 9 * 2 * window.devicePixelRatio, true);
        text(`500x: ${count[6]}`, toriaezu.x + tableSize.x / 8, toriaezu.y + tableSize.y * 0.97, 9 * 2 * window.devicePixelRatio, true);
    }

    function drawPin(x, y) {
        ctx.fillStyle = "#9a4b4b";
        ctx.strokeStyle = "#9a4b4b";

        ctx.lineWidth = 3.5 * 0.5 * 2 * window.devicePixelRatio;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < i + 3; j++) {
                ctx.beginPath();
                ctx.arc(x - (gap.x + gap.x * i * 0.5) + gap.x * j, y + 110 * 0.5 * 2 * window.devicePixelRatio + gap.y * i, 7 * 0.5 * 2 * window.devicePixelRatio, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.beginPath();

        for (let j = 0; j < 17; j++) {
            ctx.moveTo(x - (gap.x + gap.x * 15 * 0.5) + gap.x * j, y + 110 * 0.5 * 2 * window.devicePixelRatio + gap.y * 15);
            ctx.lineTo(x - (gap.x + gap.x * 14 * 0.5) + gap.x * j - 3.5, y + 115 * 0.5 * 2 * window.devicePixelRatio + gap.y * 16);
            ctx.lineTo(x - (gap.x + gap.x * 14 * 0.5) + gap.x * j + 3.5, y + 115 * 0.5 * 2 * window.devicePixelRatio + gap.y * 16);
            ctx.lineTo(x - (gap.x + gap.x * 15 * 0.5) + gap.x * (j + 1), y + 110 * 0.5 * 2 * window.devicePixelRatio + gap.y * 15);
        }
        ctx.stroke();

        for (let j = 0; j < 17; j++) {
            text(`${dupe[j]}x`, x - (gap.x + gap.x * 14 * 0.5) + gap.x * j, y + 115 * 0.5 * 2 * window.devicePixelRatio + gap.y * 16, 14 * 0.5 * 2 * window.devicePixelRatio);
        }
    }

    function drawBtn(text, x, y, w, h, textSize) {
        ctx.fillStyle = `#8f3838`;
        ctx.fillRect(x - w / 2, y - h / 2, w, h);
        if (
            mouseX >= x - w / 2 &&
            mouseX <= x + w / 2 &&
            mouseY >= y - h / 2 &&
            mouseY <= y + h / 2
        ) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            if (!(auto && text === "Auto")) ctx.fillRect(x - w / 2, y - h / 2, w, h); //wikiで|使うとバグるって聞いたことあったから人生で初めて日常生活でド・モルガンの法則使った
            canvas.style.cursor = "pointer";
            if (isClicked && text === "Auto") {
                auto = !auto;
                isClicked = false;
            }
            if (isClicked && text === "Drop 1 chip") {
                chips.push(new Chip(toriaezu.x + tableSize.x / 2, toriaezu.y + 80 * 0.5 * 2 * window.devicePixelRatio));
                chipCount--;
                isClicked = false;
            }
        }
        if (auto && text === "Auto") {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(x - w / 2, y - h / 2, w, h);
        }

        ctx.strokeStyle = `#742d2d`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 8);
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#222222';
        ctx.font = `bold ${textSize}px Ubuntu, sans-serif`;
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.strokeText(`${text}`, x, y);
        ctx.fillStyle = '#EEEEEE';
        ctx.font = `bold ${textSize}px Ubuntu, sans-serif`;
        ctx.fillText(`${text}`, x, y);
    }



    canvas.addEventListener("pointerdown", (event) => {
        mouseX = (event.clientX - canvas.getBoundingClientRect().x) * devicePixelRatio;
        mouseY = (event.clientY - canvas.getBoundingClientRect().y) * devicePixelRatio;
        isClicked = true;
    });

    canvas.addEventListener("pointerup", () => {
        isClicked = false;
    });

    canvas.addEventListener('pointermove', (event) => {
        mouseX = (event.clientX - canvas.getBoundingClientRect().x) * devicePixelRatio;
        mouseY = (event.clientY - canvas.getBoundingClientRect().y) * devicePixelRatio;
    });



    window.onresize = function () {
        resize();
    }

    function resize() {
        canvas.width = canvasSize.w * window.devicePixelRatio;
        canvas.height = canvasSize.h * window.devicePixelRatio;
        canvas.style.width = canvasSize.w + "px";
        canvas.style.height = canvasSize.h + "px";
    }







    function mainUpdate() {
        resize();
        forChip++;
        if (auto && forChip > 2) {
            chips.push(new Chip(toriaezu.x + tableSize.x / 2, toriaezu.y + 80 * 0.5 * 2 * window.devicePixelRatio));
            chipCount--;
            forChip = 0;
        }
        for (let i = 0; i < chips.length; i++) {
            chips[i].update();
            if (chips[i].phase > 16) {
                pop(chips[i].x, chips[i].y + 1 * 2 * window.devicePixelRatio);
                chips.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            if (particlesArray[i].alpha < 0) {
                particlesArray.splice(i, 1);
            }
        }
    }


    function mainDraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `#8f3838`;
        ctx.strokeStyle = `#742d2d`;
        ctx.lineWidth = 8.5 * 0.5 * 2 * window.devicePixelRatio;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.fillRect(toriaezu.x, toriaezu.y, tableSize.x, tableSize.y);
        ctx.strokeRect(toriaezu.x, toriaezu.y, tableSize.x, tableSize.y);

        drawPin(toriaezu.x + tableSize.x / 2, toriaezu.y);
        canvas.style.cursor = "default";
        drawBtn("Drop 1 chip", toriaezu.x + tableSize.x * 0.8, toriaezu.y + tableSize.y * 0.84, 60 * 2 * window.devicePixelRatio, 15 * 2 * window.devicePixelRatio, 8 * 2 * window.devicePixelRatio);
        drawBtn("Auto", toriaezu.x + tableSize.x * 0.8, toriaezu.y + tableSize.y * 0.92, 38 * 2 * window.devicePixelRatio, 15 * 2 * window.devicePixelRatio, 8 * 2 * window.devicePixelRatio);
        drawText();

        for (let i = 0; i < chips.length; i++) {
            chips[i].draw();
        }
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].draw();
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
}