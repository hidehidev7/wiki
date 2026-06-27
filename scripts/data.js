//ローワ―キャメルケース

//初期化
export const florr = {}

//入り用のデータオブジェクト
florr.dataObj = {};
($ => {
    //入力された値から、レアリティの長さの配列を生成する。データ型に近い。
    //データ型として'arrayOfRarity'と書けば、これによって生成されたものを指す。そういうことにする。
    $.createArrayOfRarity = function(param) {
        const arr = Array(florr.rarity.length);

        for(let rID = 0; i < arr.length; i++) {
            let value;
            switch(typeof param) {
                case "number", "string", "boolean": value = param; break;
                case "object":
                    if(Array.isArray(param)) {
                        //入力された配列の長さがレアリティの長さに足りているかどうか判別する。足りない場合は長さを揃える。なぜなら、この関数はデータとしての規格を揃えることを優先するからである。
                        if(arr.length > rID) {
                            value = param[rID];
                            break;
                        } else {
                            value = undefined;
                            break;
                        }
                    }
                default: value = undefined; break;
            }

            arr[rID] = value;
        }

        return arr;
    }
})(florr.dataObj);

//レアリティ関連のデータ
florr.rarity = {};
($ => {
    //レアリティID　←→　配列番号
    $.id = {};
    $.id[$.id["Cm"] = 0] = "Cm";
    $.id[$.id["Un"] = 1] = "Un";
    $.id[$.id["Re"] = 2] = "Re";
    $.id[$.id["Ep"] = 3] = "Ep";
    $.id[$.id["Lg"] = 4] = "Lg";
    $.id[$.id["My"] = 5] = "My";
    $.id[$.id["Ul"] = 6] = "Ul";
    $.id[$.id["Sp"] = 7] = "Sp";
    $.id[$.id["Uq"] = 8] = "Uq";
    $.id[$.id["Et"] = 9] = "Et";

    //レアリティID　←→　レアリティ名
    $.name = {};
    $.name[$.name["Common"] = "Cm"] = "Common";
    $.name[$.name["Unusual"] = "Un"] = "Unusual";
    $.name[$.name["Rare"] = "Re"] = "Rare";
    $.name[$.name["Epic"] = "Ep"] = "Epic";
    $.name[$.name["Legendary"] = "Lg"] = "Legendary";
    $.name[$.name["Mythic"] = "My"] = "Mythic";
    $.name[$.name["Ultra"] = "Ul"] = "Ultra";
    $.name[$.name["Super"] = "Sp"] = "Super";
    $.name[$.name["Unique"] = "Uq"] = "Unique";
    $.name[$.name["Eternal"] = "Et"] = "Eternal";

    //レアリティID　→　レアリティ色
    $.color = {
        background: {
            borderMask: "#00000030",    //フチの色（シェーダー）
            [$.id[0]]: "#7eef6d",
            [$.id[1]]: "#ffe65d",
            [$.id[2]]: "#4d52e3",
            [$.id[3]]: "#861fde",
            [$.id[4]]: "#de1f1f",
            [$.id[5]]: "#1fdbde",
            [$.id[6]]: "#ff2b75",
            [$.id[7]]: "#2bffa3",
            [$.id[8]]: "#555555",
            [$.id[9]]: "#dddddd",
        },
        text: {
            [$.id[0]]: "#000",
            [$.id[1]]: "#000",
            [$.id[2]]: "#fff",
            [$.id[3]]: "#fff",
            [$.id[4]]: "#fff",
            [$.id[5]]: "#000",
            [$.id[6]]: "#fff",
            [$.id[7]]: "#000",
            [$.id[8]]: "#fff",
            [$.id[9]]: "#000",
        }
    }
})(florr.rarity);

florr.rarity.length = Object.keys(florr.rarity.id).length / 2;

florr.themeColor = (() => {
    const ROOT = getComputedStyle(document.documentElement);

    return {
        theme: ROOT.getPropertyValue('--c-theme'),
        subTheme_dark: ROOT.getPropertyValue('--c-subTheme_dark'),
        subTheme_light: ROOT.getPropertyValue('--c-subTheme_light'),
        dark_gray: ROOT.getPropertyValue('--c-dark_gray')
    }
})();

florr.database = {//ペタル、モブ関連のデータ
    //モブの体力比
    mobHealthFactor: [1.0, 3.75, 13.5, 54, 324, 3159, 196830, 4374000, 26244000],
    //既定アーマー
    defaultArmor: 0.8,
    //それぞれのタレントのオリジナル値
    talentOriginalValue: {
        reload: 1,
        medic: 1,
        duplicator: 0,
        poison: 1,
        CPoison: 1,
        summoner: 1,
        luck: 0,
        pHealth: 1,
    },
    //選択可能なTalentの獲得レアリティ
    talentRarity: {
        reload: [0, 1, 2, 3, 4, 5, 6, 7, 9],
        medic: [0, 1, 2, 3, 4, 5, 6, 7, 9],
        duplicator: [0, 4, 6],
        poison: [0, 1, 2, 2, 2, 2, 2, 2, 2],
        CPoison: [7],
        summoner: [0, 1, 2, 3, 4, 5, 6, 7, 9],
        luck: [0, 1, 2, 3, 4, 5, 6, 7, 9],
        pHealth: [0, 1, 2, 3, 4, 5, 6, 7, 9],
    },
    talentName: {
        JP: {
            reload: "再生成",
            medic: "医者",
            duplicator: "複製",
            poison: "毒",
            CPoison: "凝縮された毒",
            summoner: "召喚士",
            luck: "運",
            pHealth: "花びら体力",
        },
        EN: {
            reload: "Reload",
            medic: "Medic",
            duplicator: "Duplicator",
            poison: "Poison",
            CPoison: "Contentrated Poison",
            summoner: "Summoner",
            luck: "Luck",
            pHealth: "Petal Health",
        }
    },
    //上の対応するtalentRarityにおけるオリジナル値への加算値
    talentFactor: {
        reload: [-0.10, -0.19, -0.271, -0.344, -0.475, -0.58, -0.664, -0.731, -0.812],
        medic: [0.15, 0.322, 0.521, 0.749, 1.011, 1.313, 1.66, 2.059, 3.046],
        duplicator: [0, 1, 2],
        poison: [0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625],
        CPoison: [-0.167777],
        summoner: [0.15, 0.322, 0.521, 0.749, 1.011, 1.313, 1.66, 2.059, 3.046],
        luck: [0.1, 0.25, 0.45, 0.7, 1, 1.35, 1.75, 2.2, 2.7],
        pHealth: [0.15, 0.322, 0.521, 0.749, 1.011, 1.313, 1.66, 2.059, 3.046],
    },
}
