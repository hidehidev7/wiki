import { florr } from "https://hidehidev7.github.io/wiki/scripts/data.js";
window.florr = florr;

export default function (baseChance) {
    const main = {
        getDropTable: `
let dropTableStr = "[";
for(let mob = 0; mob < ${window.florr.rarity.length}; mob++) { //mob
    if(mob !== 0) dropTableStr += ","
    let dropListStr = "[";
    for(let petal = 0; petal < ${window.florr.rarity.length}; petal++) { //petal
        if(petal !== 0) dropListStr += ","
        let dropStr = florrio.utils.calculateDropChance(${baseChance},mob,petal).toFixed(8);
        if(dropStr == 0) dropStr = "0";
        dropListStr += dropStr;
    }
    dropListStr += "]";
    dropTableStr += dropListStr;
}
dropTableStr += "]";
console.log(dropTableStr);`,
        getDropTableZip: `let t="[";for(let m=0;m<${window.florr.rarity.length};m++){if(m!==0)t+=",";let l="[";for(let p=0;p<${window.florr.rarity.length};p++){if(p!==0)l+=",";let d=florrio.utils.calculateDropChance(${baseChance},m,p).toFixed(8);if(d==0)d="0";l+=d}l+="]";t+=l}t+="]";console.log(t);`,
    }
    main.getAll = `
const baseChanceArr = ＜入力＞;
let wholeStr = "";
baseChanceArr.forEach((baseChance, i) => {
    let dropTableStr = "[";
    for(let mob = 0; mob < ${window.florr.rarity.length}; mob++) { //mob
        if(mob !== 0) dropTableStr += ","
        let dropListStr = "[";
        for(let petal = 0; petal < ${window.florr.rarity.length}; petal++) { //petal
            if(petal !== 0) dropListStr += ","
            let dropStr = florrio.utils.calculateDropChance(baseChance,mob,petal).toFixed(8);
            if(dropStr == 0) dropStr = "0";
            dropListStr += dropStr;
        }
        dropListStr += "]";
        dropTableStr += dropListStr;
    }
    dropTableStr += "]";
    wholeStr += "\\"" + baseChance.toString() + "\\": " + dropTableStr;
    if(i !== baseChanceArr.length - 1) wholeStr += ",";
});
console.log(wholeStr);`
    return main;
}