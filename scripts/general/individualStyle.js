import { getDecodedPageName } from "./../util/document.js";

export const main = async () => {
    const data = await fetch("./../../css/individual/index.json");
    const index = await data.json();
    const page = getDecodedPageName();

    if(!page) return;
    if(!index.pages.hasOwnProperty(page)) return;
    /** @type {string | string[]} */ const nameData = index.pages[page];
    const fileNames = typeof nameData === "string" ? [nameData] : nameData;
    for(const fileName of fileNames) {
        const cssData = await fetch(`./../../css/individual/${fileName}.css`);
        const cssText = await cssData.text();

        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = cssText;
        document.body.appendChild(stylesheet);
    }
};