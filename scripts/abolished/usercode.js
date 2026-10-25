export function main() {
    const ORDER = document.getElementsByClassName("usercode");

    if (ORDER) {
        for (let i = 0; i < ORDER.length; i++) {
            let code = ORDER[i].textContent;
            ORDER[i].innerHTML = code;

            console.log(`${i} userCodeが実行されました：`, code);
        }
    }
}