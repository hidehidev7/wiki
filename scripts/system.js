/* -----------------------------------------------
 
florr.io JPwiki 総合管理システム
 
(c) florr.io JPwiki
 
----------------------------------------------- */


import { florr } from "https://hidehidev7.github.io/wiki/scripts/data.js"


window.florr = florr;



const runFromPath = async (path = "", arg = {}) => {
    try {
        const OBJ = await import(path);
        OBJ.main(arg);

        console.log(`外部スクリプト\n${path}\nが読み込まれました。`, arg);
    } catch (error) {
        console.log(`外部スクリプト\n${path}\nの読み込みに失敗しました。`, error);
    }
}
const safetyProc = (arg = undefined) => {
    if (typeof arg === "object") {
        let res = arg;

        if (Array.isArray(res)) {
            res.forEach(e => {
                if (typeof e === "function") e = undefined;
            });
        } else {
            Object.keys(res).forEach(p => {
                if (typeof p === "function") res[p] = undefined;
            });
        }

        return res;
    }

    return {};
}
const getArg = (text = "", type = "") => {
    switch (type) {
        case "object":
            //JSON.parse()ではプロパティ名がstringでないといけないため正しくパースできない
            const OBJ = new Function(`return {${text}};`);
            return safetyProc(OBJ());
        case "string":
            return text;
        case "number":
            return parseFloat(text);
        case "boolean":
            return !!text;

        default:
            return undefined;
    }
}
const runScript = (o = {}) => {
    let data = {
        url: "",
        arg: {}
    }

    if (o.property.url) {
        data.url = o.property.url
    } else {
        data.url = `https://hidehidev7.github.io/wiki/scripts/${o.type}/${o.funcName}.js`;
    }

    if (o.property.arg.options) data.arg.options = getArg(o.text, o.property.arg.options);
    if (o.property.arg.originId) data.arg.originId = o.id;

    runFromPath(data.url, data.arg);
}
const load = (json, type) => {
    const loadByFncName = (funcName = "", property = {}) => {
        switch (type) {
            case "general":
                runScript({
                    property,
                    type,
                    funcName,
                    text: ""
                });
                break;
            case "unique syntax":
                const SYNTAX = document.querySelectorAll(`.user_body span.${funcName}`);

                for (let i = 0; i < SYNTAX.length; i++) {
                    const SPAN = SYNTAX[i];
                    const ID = `${funcName}${i}`;
                    SPAN.id = ID;
                    SPAN.style.display = "none";

                    runScript({
                        property,
                        type,
                        funcName,
                        text: SPAN.textContent,
                        id: ID
                    });
                }
                break;
            case "external":
                runScript({
                    property,
                    type,
                    funcName,
                    text: ""
                });
                break;

            default:
                break;
        }
    }

    const SCRIPTS = Object.keys(json[type]);
    SCRIPTS.forEach(n => loadByFncName(n, json[type][n]));
}

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
}

//???
(() => {
    const nf9348 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAAXNSR0IArs4c6QAAAD9QTFRFR3BMw7BLx7RMyrZNzLhOzLhOzblO7u7u/+dj2NnY9t9f69Rb3chVtre2z7tQrJ1KgoKCiX0/ZF5BQT4vISEh9NKZcgAAAAd0Uk5TAB1Ea57E6Sq1qPoAAAc3SURBVHja7Z3rbusqFIRjbqELAjHw/s96cvZFSfe0iWGRGKLOz0qW+mlmlh1f4PAkLUJIdZHW2oRgjNbqIinEcphFQigV7kopIcZmWITSYaO0EsuoECZUygwHs0gTGmXkMhzF3CxShw7Scl8KoUI3KbEfhg5dpfdBwWbwZeTrCx5Ag6Lw55S/yF1Ejtz/8heNNcMAAwgckf1GRA54AGWAintHdoPI+Z1rv6gKCAaMWvZKlXe2Qc7vkq9FV1CwWfTTTJF1FPyMyVfa4cl2EPmXmSK+bAfUuzOKES+JlbNd5Z8fr0Uz3GCg9I7XYhjdYAfMdCORLAz+NDbyaRzOPlHuSUVRfDv4+VJ8Dqw5YLzCFM3mYNjR1RTdmcPZF8n1JFk0I1ZcUUcSzYlV/3jpbhz2xepEorn14Mv1IJHIsT+J4nOQ3UXEPccL5BiDRPCud8nuJmJdCxsYu+OQMAYWcOxKopuLTnZnUWPhBXAMRiKaiu7sAHIthdfAMRyJqi+It4PI19ZkAY5B5CvDpaHog4jqZrAEjkFJZM3EcnYouYpwKSjISPKbJ5fAYI0bLrG16c4OJ7ex7wKCNXS4xLam2xFFmy7oJQRr8HDJDYZ4O6j8Y0skTKxJLWE13cUYqw/yMQbHsqS3IS6V/5WqUPyfgypR6JEljIbE8lex5aDQyxI8h1Rz1JOspTSS0P1ziW42xJdS/0+FcivXbInuaEgut8q0qVSfD0r9LFHNhsTyWWtFsCCR9ZYoqHrjyHLlX7mKNIKPdZZg3SXHELCkwhC+JRKq3mQI5QKihwcVUG5pCdZ9aTYkFFSscLFxBIcbLZCslsveVFB545xjDC4H2cKq13lcvpKrmA/8uuunJCvnXEqsTFZOuRTfXHdusnD8pPPH8Xg8l1QTx3Q6XpRK5GULk9VckXw6/tLpUUkyYAB9Vd01P1m2XJWOf1UKba3I+fhHH0D/MFt4ThTNyXLIcVG+P0sDclxAcnHN2RJ4nRVsY9fzxxXkfD/vEeCBvjJbCirS/ovqdLwFWbcNiCs8tL0lWwskq35o5eONTveLm8AQoK/MllmgItQIcm4BOX06qBaEoCRQkSoQDMnxo6RN0/cIILyS6OaK2ATJqgBJR7CxSv7fMwlUhA+SGSBNJYGKzAOCJRFQkUlBFFRk/LJj23uBnJ4/flH+M4iBrjeApBaQM5wQWW2Hru9ziXIukQESDoeFAxIKWMK5aGS0fYGhVX0ZjzlJNZfxVxDHARE8EAu/keB/ukufb35YFVutTyCydWjhr9aPjT91yy0+HNQGInH6Mm4+nE/HbTcf8KAEA6Jy/iII73ZQSudcezsop3QuJfQDgWS33qDzj+/Fo6g7yKi3TFHuFkTzQGJBrY+bhQo8EI0g/Gy5+odDJRMPxMClVq3WlpCkgi5yQbivbfiWkAR0kQkS2CB2bWgtpR6GWOoK4mD2blCAhvAdgY7wBlds8TFYPogBR6q1tmQkwUE7Ti0kSdvznbgc/PMIKubfUY+Mg7ggqgeIpbCmNVLlQXFNayDbA0QByADiX8b/gIwAIucEwZ+6Ilw1MYiYGYRuQeAG3aQgy+EwHgj/3q+bGQTm75zTd1oQfNAz8di68wyR5h1a0PY5uw7v1EzadQ2vcMzb9XlLgi/VLHOWxH3q+qQlwRfPoCSzVgRK4mZMlmC8LjtasqAkYcJkacYr5fsKXymfM1v4kv+82SJI1qTZwmRhtsJkVQ/sj8VQVOWmo67Jwmx5xsOFvNnPkEuOPaoumR9Uonz9ozfHN8R0+sQVnyUm2v64KvINUZ0+OkaQksOGWAFIoyFh6fcZOD4VXN3dkq/4xJHzGXg/S5CkxG/zRTfvZhLfEPFoqQTuI/f8NYqL+QrbfUER/uIVmP6L1kDwxLRcSb0FMRavYFqCorVcldfoif5saBFTLletZPsbwrcETbkq55Ty9W8w2JiGdLUEz/B3lWOnqyzz7EWQKOZ7GPTMFXdwWSqyHMVUvlSKHZeles1CYW5N/zYjRdd1obCXLd1G4QLzWynBNOYGS796MT266BmL6S1vtrzh/AtOzrgEKHIE+Y6Lss6/TO78CxeLN15Kev7Fvedfbn3+BfDff0sClAGSYTjM+27bMf9GKvNvbTP/ZkOyx7Z7bn8O9Z4bcs2/RRqfJNB+sQr6ZxvBoTd25JMEt4MdQb3J5qfyZztaxgbB3e0w4mfLZiDR4RUoVLGJNqPyKEeDbGvO32je77DR/NBb/zsfvpKCWHWcXv0TRi6gcDvz/qagvOOaUddyvqQJTBakYNjB0KLCt/J1GSOggHY8VUKHwIFBCJRmDCtOvpDGEX1DQA4YODO3PwrKe+9+idxveQ8IO5QDURjaFQNR5sXA2vOEFd9LQvUzQ4nDrpK6ixnysL8WqeelQBbTmCgtl8NQWoQyDb0AilFgtNnqBEAMSHPXG2MUMAyNI6S6SGtjQjBGa3WRFE9D+A9TibjTI3iU+QAAAABJRU5ErkJggg==";
    (() => {
        function async_digestMessage(message) {
            return new Promise(function (resolve) {
                var msgUint8 = new TextEncoder("utf-8").encode(message);
                crypto.subtle.digest('SHA-256', msgUint8).then(
                    function (hashBuffer) {
                        var hashArray = Array.from(new Uint8Array(hashBuffer));
                        var hashHex = hashArray.map(function (b) { return b.toString(16).padStart(2, '0') }).join('');
                        return resolve(hashHex);
                    });
            })
        }
        if (window.Promise && window.crypto) {
            async_digestMessage(deffForTips.funcForSmallChance.toString()).then(function (shatxt) {
                //console.log(shatxt);
                (shatxt === "d56ccefd9b46635e6db43efe642ea81054b5a5743955f51e0e4e745e4850c2fb") && changeIt();
                //console.log(shaAns)
            });
        } else {
            changeIt();
        };
        function changeIt() {
            //console.log("good!");
            deffForTips[deffForTips["st" + "rA" + "ry"][18]] = function () {
                window["ch" + "an" + "ge" + "Te" + "xt" + "Fo" + "rT" + "ips"]("\u50c5" + "\u304b" + "\u5343" + "\u5206" + "\u306e" + "\u4e00" + "\u306e" + "\u78ba" + "\u7387" + "\u3067" + "\u8868" + "\u793a" + "\u3055" + "\u308c" + "\u308b" + "\u3053" + "\u306e" + "\u30e1" + "\u30c3" + "\u30bb" + "\u30fc" + "\u30b8" + "\u3002" + "\u904b" + "\u304b" + "\u52aa" + "\u529b" + "\u304b" + "\u5b9f" + "\u529b" + "\u304b" + "\u3001" + "\u305d" + "\u306e" + "\u58c1" + "\u3092" + "\u8d8a" + "\u3048" + "\u305f" + "\u3042" + "\u306a" + "\u305f" + "\u306b" + "\u3002" + "\u660e" + "\u65e5" + "\u306f" + "\u304d" + "\u3063" + "\u3068" + "\u3001" + "\u3044" + "\u3044" + "\u3053" + "\u3068" + "\u304c" + "\u3042" + "\u308a" + "\u307e" + "\u3059" + "\u3088" + "\u3002")
            };
        }
    })();
    const nvq32984 = "data:image/png;base64,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";
    if (Math.floor(Math.random() * (10 - 0)) === 1) {
        console.log(
            "%c ",
            `
        background-image:url("${nvq32984}");
        background-size: 100 %;
        padding: 100px;
        background-position: center;
        background-repeat: no-repeat;
        `
        );
        console.log("\u3044\u3064\u3082\u3000\u304d\u307f\u3092\u3000\u307f\u3066\u308b\u3088");
    } else {
        console.log(
            "%c ",
            `
        background-image:url("${nf9348}");
        background-size: 100 %;
        padding: 100px;
        background-position: center;
        background-repeat: no-repeat;
        `
        );
        console.log("\u30b3\u30f3\u30bd\u30fc\u30eb\u3078\u3088\u3046\u3053\u305d\uff01");
    }
})();