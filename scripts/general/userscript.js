export function main() {
    const ORDER = document.getElementsByClassName("userscript");

    if (ORDER) {
        for (let i = 0; i < ORDER.length; i++) {
            let code = ORDER[i].textContent;
            let script = document.createElement("script");
            script.innerText = code;
            script.textContent = code;
            ORDER[i].textContent = "";
            document.body.appendChild(script);

            console.log(`${i} userScriptが実行されました：`, code);
        }
    }
}