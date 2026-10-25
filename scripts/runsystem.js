import { load, _ } from "./system.js";
import { PROD_ROOT_PATH } from "./data.js";

const CONFIG = await (async () => {
    try {
        const REQ = await fetch(PROD_ROOT_PATH + "scripts/config.json")
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