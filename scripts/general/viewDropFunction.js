//wikiのdropcode_jsonのページに自動生成したコードを表示する
import dropGetFunc from "https://hidehidev7.github.io/wiki/scripts/util/dropget.js";

export function main() {
    const targetPageName = "dropcode_json";
    const q = window.location.pathname.split("/");
    const presentPageName = q[q.length - 1];
    if(targetPageName !== presentPageName) return;

    generateCodeIn(document.getElementById("dropfunc"));
}

function generateCodeIn(whole) {
    const controlBox = document.createElement("div");
    whole.appendChild(controlBox);

    const baseChanceField = document.createElement("input");
    baseChanceField.placeholder = "baseChanceを入力";
    baseChanceField.width = "100px";
    controlBox.appendChild(baseChanceField);

    const button = document.createElement("button");
    button.textContent = "生成する";
    button.onclick = () => {
        const baseChanceStr = baseChanceField.value;
        const dropGet = dropGetFunc(baseChanceStr);
        functionList.forEach(e => e.box.setFunction(dropGet[e.funcName]));
    }
    controlBox.appendChild(button);

    const functionList = [
        {funcName:"getDropTable",description:"あるbaseChanceのjsonを生成する",box:null,},
        {funcName:"getDropTableZip",description:"あるbaseChanceのjsonを生成する（圧縮済）",box:null,},
        {funcName:"getAll",description:"配列に含まれるbaseChanceのjsonを全て生成する",box:null,}];
    functionList.forEach((e, i) => {
        const box = document.createElement("div");
        const h4 = document.createElement("h4");
        h4.textContent = e.description;
        box.appendChild(h4);
        const pre = document.createElement("pre");
        pre.classList.add("highlight");
        box.appendChild(pre);
        const code = document.createElement("code");
        code.classList.add("highlight_code");
        pre.appendChild(code);

        box.setFunction = function(text) {
            code.textContent = text;
        }

        controlBox.appendChild(box);
        functionList[i].box = box;
    })
}