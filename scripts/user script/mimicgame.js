"use strict";


function mimicPlay() {

    const imgHTMLElements = document.getElementsByTagName("img");
    const allImages = [];
    for (let i = 0; i < imgHTMLElements.length; i++) allImages.push(imgHTMLElements[i]);
    const images = allImages.filter(element => (element.style.width === "60px"));
    const mimicElement = images.filter(e => e.parentNode.title === "Mimic")[0];
    if (!mimicElement) return;
    images.splice(images.indexOf(mimicElement), 1);
    const imageBoxes = images.map(img => img.parentNode);
    const originalMimicSrc = mimicElement.src;
    const mimicGrandma = mimicElement.parentNode.parentNode;

    const userBodyElement = document.getElementsByClassName("user_body")[0];

    const menuDiv = document.createElement("div");
    menuDiv.style.textAlign = "center";
    userBodyElement.appendChild(menuDiv);

    const startButton = document.createElement("button");
    startButton.style = "border: 5px solid #91103d; background-color:#ff2b75; line-height:130%;";
    startButton.textContent = "Mimicゲームを遊ぶ";
    startButton.onclick = readyForGame;
    menuDiv.appendChild(startButton);

    const textElement = document.createElement("span");
    textElement.style = "line-height:130%;";
    menuDiv.appendChild(textElement);

    const manager = {
        readyForGame: false,
        firstPlay: true,
        clicked: 0,
        beginTime: false,
        finishTime: false,
        score: 0,
    }

    function readyForGame() {
        if (manager.readyForGame) return;
        manager.readyForGame = true;
        manager.clicked = 0;
        manager.beginTime = false;
        manager.finishTime = false;
        manager.score = 0;

        const mama = mimicElement.parentNode;
        mama.removeChild(mimicElement);
        if (manager.fisrtPlay) {
            mama.after(mimicElement);
            mimicGrandma.removeChild(mama);
        } else {
            mimicGrandma.appendChild(mimicElement);
        }

        mimicElement.onclick = mimicClicked;

        textElement.textContent = "ペタルの中に隠れたMimicを見つけましょう。Mimicをクリックするとスタートします";
    }

    function mimicClicked() {
        if (manager.finishTime) return;
        mimicElement.src = originalMimicSrc;
        if (!manager.beginTime) {
            manager.beginTime = Date.now();
            textElement.textContent = "タイムを計測中・・・";
            sendMimic();
        } else {
            manager.clicked++;
            if (manager.clicked >= 5) {
                endGame();
            } else {
                setTimeout(sendMimic, 500);
            }
        }
    }

    function sendMimic() {
        const mama = mimicElement.parentNode;
        const choice = imageBoxes.filter(e => e.parentNode !== mama);
        const choseOne = choice[Math.floor(Math.random() * choice.length)];
        mama.removeChild(mimicElement);
        choseOne.after(mimicElement);
        mimicElement.src = choseOne.children[0].src;

        let tick = 0;
        images.forEach(img => {
            img.randomXZure = 1 + Math.random();
            img.randomYZure = Math.random() - 0.5;
        })
        const interval = setInterval(() => {
            tick++;
            images.forEach(img => {
                const zure = -2 * (Math.pow(tick - 9, 2) - 81);
                img.style.translate = `${img.randomXZure * zure}px ${img.randomYZure * zure}px`;
            });
            if (tick === 18) clearInterval(interval);
        }, 20);

        //console.log(choseOne.children[0].src);
    }

    function endGame() {
        manager.finishTime = Date.now();
        manager.score = (manager.finishTime - manager.beginTime) / 1000;
        textElement.textContent = "スコア：" + manager.score.toFixed(1) + "秒";
        manager.readyForGame = false;
        manager.firstPlay = false;
        startButton.textContent = "もう一度遊ぶ";
        mimicElement.onclick = () => { };

        setTimeout(_ => {
            let tick = 0;
            const interval = setInterval(() => {
                tick++;
                const zure = 0.5 * (Math.pow(tick - 10, 2) - 100);
                mimicElement.style.translate = "0px " + zure + "px";
                if (tick === 50) {
                    clearInterval(interval);
                    mimicElement.parentNode.removeChild(mimicElement);
                    startButton.after(mimicElement);
                    mimicElement.style.translate = "0px 0px";
                }
            }, 20);
        }, 500);
    }

    console.log(mimicElement);
}

export const main = () => {
    mimicPlay();
}