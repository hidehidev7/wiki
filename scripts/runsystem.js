import { load, _ } from "./system.js";

const CONFIG = await (async () => {
    try {
        const REQ = await fetch("https://hidehidev7.github.io/wiki/scripts/config.json")
        const RES = await REQ.json();

        console.log("config.jsonが読み込まれました。", RES);

        return RES;
    } catch (error) {
        console.log("config.jsonの読み込みに失敗しました。", error)
    }
})();

{
    load(CONFIG, "general");
    load(CONFIG, "unique syntax");
    load(CONFIG, "external");
    load(CONFIG, "user script");
}

_();