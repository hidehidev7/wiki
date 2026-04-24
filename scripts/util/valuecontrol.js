import { florr } from "https://hidehidev7.github.io/wiki/scripts/data.js";
window.florr = florr;

const convertString = function(string, options = [], params = {}) {

    let out = "";
    let i = 0;

    function isHead() {
        return i === 0;
    }

    function isTail() {
        return i + 1 === string.length;
    }

    const F = {};
    /** 半角スペースの次の文字がアルファベットなら半角スペースを抜いて大文字にする */
    F["next_space_upper"] = () => {
        if(!isTail() && string.slice(i, i + 2).match(/^ [a-zA-Z]$/)) {
            i++;
            return string.charAt(i).toUpperCase();
        }
    }
    /** 語頭が大文字アルファベットなら小文字にする */
    F["head_lower"] = () => {
        if(isHead() && string[i].match(/[A-Z]/)) {
            return string[i].toLowerCase();
        }
    }
    /** 語尾に_Mobを付ける */
    F["tail_mob_img"] = () => {
        if(isTail()) {
            return string[i] + "_Mob";
        }
    }

    /** 語頭に画像名のレアリティを付ける */
    F["head_rarity_img"] = () => {
        if(isHead() && typeof params.rarity === "number") {
            return window.florr.rarity.id[params.rarity] + "_" + string[i];
        }
    }

    for(; i < string.length; i++) {
        let char;
        for(let funcI = 0; funcI < options.length; funcI++) {
            const ans = F[options[funcI]]();
            if(typeof ans === "string") {
                char = ans;
                break;
            }
        }
        if(typeof char !== "string") char = string[i];
        out += char;
    }
    return out;
}

/** ペタルの名前を画像名に変換する
 * @param {string} string ペタルのページ名の文字列
 * @param {number} rarity 画像のレアリティ
*/
export const convertPetalIntoImageName = function(string, rarity = 0) {
    return convertString(string, ["next_space_upper", "head_rarity_img"], { rarity: rarity });
}

/** モブの名前（(mob)を除く）を画像名に変換する
 * @param {string} string モブの名前の文字列
 * @param {number} rarity 画像のレアリティ
*/
export const convertMobIntoImageName = function(string, rarity = 0) {
    const withoutMob = convertString(string, ["next_space_upper", "head_rarity_img"], { rarity: rarity });
    return convertString(withoutMob, ["tail_mob_img"]);
}