/* ----------
petalcode (statustable ver4.3)
---------- */

import { createStatusTable, PulldownMenufyHost, TALENTS_FACTOR_DEFAULT, TALENTS_VAL, insertTableBeforeOriginId } from "./../util/statustable.js"

//specialStatusのオプションを、fieldとcolumnに振り分ける。補完は行わない
const convertSpecialStatusInto = function (options) {

    let Fopts = {};
    let Copts = {};

    //type
    switch (options.type) {
        case "rarity":
            Fopts.type = "unique";
            break;
        default:
            Fopts.type = options.type;
    }

    switch (options.type) {
        case "rarity":
            Copts.viewType = "rarity";
            break;
        default:
            Copts.viewType = "normal";
    }

    //other
    Fopts.base = options.base;
    Fopts.increase = options.increase;
    Fopts.magnification = options.magnification;
    if (options.type == "rarity") Fopts.uniqueDatas = options.uniqueDatas ?? options.uniqueRarityNumbers; //後方互換
    if (options.type == "unique") Fopts.uniqueDatas = options.uniqueDatas;
    Fopts.relatedTalent == options.relatedTalent;
    Fopts.baseFieldId = options.baseFieldId;
    Fopts.secondBaseFieldId = options.secondBaseFieldId;

    Copts.name = options.name;
    Copts.last = options.last;
    Copts.first = options.first;
    Copts.width = options.width;
    Copts.toFixed = options.toFixed;
    Copts.isHidden = options.isHidden ?? false;

    return { field: Fopts, column: Copts };
}




export const main = ($) => {

    const TALENTS_FACTOR = { ...TALENTS_FACTOR_DEFAULT };

    const finalFieldOptions = {};
    const finalColumnOptionsArr = [];

    //$.optionsからfieldOptionsとcolumnOptionsを生成
    {
        let specialColumnOptionsArr = []; //SpecialStatusのColumnOptionと$.options.specialColumnArrの融合
        let specialFieldOptions = {};

        //specialStatusは、FieldとColumnの簡易指定版
        //fieldOptionsは新しいFieldの追加に対応している。とはいえ、isHiddenを使用することで、fieldOptionsとして扱うことができるようにする。
        //Fieldに新しいプロパティが追加されるたびにここを更新すること
        //specialStatus
        if ($.options.specialStatus) {

            for (let i = 0; i < $.options.specialStatus.length; i++) {

                let opts = $.options.specialStatus[i];
                let Fopts, Copts;
                    
                let converted = convertSpecialStatusInto(opts);
                Fopts = converted.field;
                Copts = converted.column;

                //補完
                let id = opts.id ?? "special_" + i;
                if (Fopts.type == "heal") { //heal処理

                    let secondId = id + "_2";
                    let Fopts2 = {};
                    Object.assign(Fopts2, Fopts)
                    Fopts2.relatedTalent ??= "medic";
                    specialFieldOptions[secondId] = Fopts2;
                    Fopts = {
                        type: "FtimesF",
                        baseFieldId: secondId,
                        secondBaseFieldId: "petalCountChangeRatio",
                    }
                }
                Copts.fieldId = id;

                specialFieldOptions[id] = Fopts;
                if (!Copts.isHidden) specialColumnOptionsArr.push(Copts);
            }
        }

        $.options.specialColumnOptionsArr && $.options.specialColumnOptionsArr.forEach(opts => specialColumnOptionsArr.push(opts));

        //この時点でspecialFieldOptionsとspecialColumnOptionsArrが完成

        let isFieldValid = {}; //そのフィールドが有効な値であるかどうか（表示するかどうかに関係する）。fieldDict設定時に検査して指定。

        //----- fieldOptionsおよび基本オプションから、FieldDictを生成する -----

        $.options.fieldOptions ??= {};

        //レアリティ。ユーザーに上書きされない。
        $.options.fieldOptions["petalRarity"] = {
            "type": "constant",
            "base": 0,
            "increase": 1,
        };

        //petalCount。ユーザーに上書きされない。
        {
            let popts = {}

            if ($.options.petalUniqueCounts) {
                popts = {
                    "type": "unique",
                    "uniqueDatas": $.options.petalUniqueCounts,
                    "isHidden": true,
                }
            } else {
                popts = {
                    "type": "constant",
                    "increase": 0,
                    "base": $.options.petalCount ?? 1,
                    "isHidden": true,
                }
            }
            $.options.fieldOptions["petalCount"] = popts; //ペタルの個数のユーザー入力値

            let popts2 = {
                "relatedTalent": "duplicator",
                "type": "FplusB",
                "base": 0,
                "baseFieldId": "petalCount",
            }
            $.options.fieldOptions["petalCount2"] = popts2; //Duplicatorの影響を受ける

            let popts3 = {
                "type": "FoverF",
                "baseFieldId": "petalCount2",
                "secondBaseFieldId": "petalCount",
            }
            $.options.fieldOptions["petalCountChangeRatio"] = popts3; //増加割合　計算用

            //uniqueCountsが定義されている、または、（petalcountがfalseでないかつ１でない）なら有効な値となる。
            isFieldValid["petalCount"] = $.options.petalUniqueCounts || ($.options.petalCount && $.options.petalCount !== 1);
        }

        isFieldValid["damage"] = !!($.options.fieldOptions.damage ||  $.options.baseDamage);

        //総攻撃力(基礎)
        $.options.fieldOptions["damage"] ??= {
            "type": "normal",
            "base": $.options.baseDamage ?? 0,
        };

        //単体攻撃力
        $.options.fieldOptions["singleDamage"] ??= {
            "type": "FoverF",
            "baseFieldId": "damage",
            "secondBaseFieldId": "petalCount",
        };

        //総攻撃力（最終）
        $.options.fieldOptions["finalDamage"] ??= {
            "type": "FtimesF",
            "baseFieldId": "damage",
            "secondBaseFieldId": "petalCountChangeRatio",
        };

        isFieldValid["healthSum"] = !!($.options.fieldOptions.healthSum ||  $.options.baseHealth);

        //体力の和
        $.options.fieldOptions["healthSum"] ??= {
            "type": "normal",
            "base": $.options.baseHealth ?? 0,
            "relatedTalent": "pHealth",
        };

        //体力
        $.options.fieldOptions["health"] ??= {
            "type": "FoverF",
            "baseFieldId": "healthSum",
            "secondBaseFieldId": "petalCount",
        };

        //リロード
        {
            isFieldValid["reload"] = !!($.options.fieldOptions.reload || $.options.reloadUniqueTimes || $.options.reloadTime);

            let ropts;
            if ($.options.reloadUniqueTimes) {
                ropts = {
                    "relatedTalent": "reload",
                    "type": "unique",
                    "uniqueDatas": $.options.reloadUniqueTimes,
                };
            } else {
                ropts = {
                    "relatedTalent": "reload",
                    "type": "constant",
                    "base": $.options.reloadTime ?? 0,
                    "increase": 0,
                };
            }
            $.options.fieldOptions["reload"] ??= ropts
        }

        //セカンドリロード
        {
            isFieldValid["secondReload"] = !!($.options.fieldOptions.secondReload || $.options.secondReloadUniqueTimes || $.options.secondReloadTime);

            let ropts;
            if ($.options.secondReloadUniqueTimes) {
                ropts = {
                    "type": "unique",
                    "uniqueDatas": $.options.secondReloadUniqueTimes,
                }
            } else {
                ropts = {
                    "type": "constant",
                    "base": $.options.secondReloadTime ?? 0,
                    "increase": 0,
                }
            }
            $.options.fieldOptions["secondReload"] ??= ropts;
        }

        //リロード合計
        $.options.fieldOptions["reloadSum"] ??= {
            "type": "FplusF",
            "baseFieldId": "reload",
            "secondBaseFieldId": "secondReload",
        };

        isFieldValid["poison"] = !!($.options.fieldOptions.poison || $.options.basePoison);
        //毒
        $.options.fieldOptions["poison"] ??= {
            "type": "normal",
            "base": $.options.basePoison ?? 0,
            "relatedTalent": "poison",
        };

        //毒持続
        $.options.fieldOptions["poisonDuration"] ??= {
            "type": "constant",
            "base": $.options.poisonDuration ?? 0,
            "increase": 0,
            "relatedTalent": "CPoison",
        };

        //毒秒間
        $.options.fieldOptions["poisonPerSec"] ??= {
            "type": "FoverF",
            "baseFieldId": "poison",
            "secondBaseFieldId": "poisonDuration",
            "isHidden": true,
        };

        let petalCountIsHidden; //それぞれのColumnが表示されるかどうかを決定する
        let damageIsHidden;
        let healthIsHidden;
        let reloadIsHidden;
        let poisonIsHidden;

        petalCountIsHidden = !(isFieldValid["petalCount"]);
        damageIsHidden = !(isFieldValid["damage"]);
        healthIsHidden = !(isFieldValid["healthSum"]);
        reloadIsHidden = !(isFieldValid["reload"] || isFieldValid["secondReload"]);
        poisonIsHidden = !(isFieldValid["poison"]);

        //ここまで、入力オプションの仕様に依存
        //これ以降、field系の入力されたオプションの使用を禁止

        //-----ColumnArrを生成する -----
        $.options.columnOptions ??= {}; //ユーザー指定可

        $.options.columnOptions.rarity = {
            "name": "レアリティ",
            "viewType": "rarity",
            "fieldId": "petalRarity",
            "width": 95,
        };

        $.options.columnOptions.petalCount = {
            "name": "ペタルの個数",
            "viewType": "normal",
            "toFixed": 0,
            "last": "個",
            "fieldId": "petalCount2",
            "isHidden": petalCountIsHidden,
        };

        $.options.columnOptions.damage ??= {
            "name": petalCountIsHidden ? "攻撃力" : "総攻撃力",
            "viewType": petalCountIsHidden ? "normal" : "damage",
            "fieldId": "finalDamage",
            "secondFieldId": "singleDamage",
            "isHidden": damageIsHidden,
        }

        $.options.columnOptions.health ??= {
            "name": "体力",
            "viewType": "normal",
            "fieldId": "health",
            "isHidden": healthIsHidden,
        }

        $.options.columnOptions.reload ??= {
            "name": "再生時間",
            "viewType": "reload",
            "fieldId": "reload",
            "secondFieldId": "secondReload",
            "last": "s",
            "isHidden": reloadIsHidden,
        }

        $.options.columnOptions.poison ??= {
            "name": "毒",
            "viewType": "poison",
            "fieldId": "poison",
            "secondFieldId": "poisonDuration",
            "isHidden": poisonIsHidden,
        }

        //この時点で、specialFieldOptions, $.options.fieldOptions, specialColumnOptionsArr, $.options.columnOptionsの４つが完成している

        //統合
        Object.assign(finalFieldOptions, $.options.fieldOptions);

        Object.assign(finalFieldOptions, specialFieldOptions);

        let arr = ["rarity", "petalCount", "damage", "health", "reload", "poison"];
        arr.forEach(id => finalColumnOptionsArr.push($.options.columnOptions[id]));

        specialColumnOptionsArr.forEach(opt => finalColumnOptionsArr.push(opt));
    }

    const TABLE = createStatusTable(finalFieldOptions, finalColumnOptionsArr, {
        leastRarity: $.options.leastRarity,
        maxRarity: $.options.maxRarity,
        boolRarities: $.options.boolRarities,
        TALENTS_FACTOR: TALENTS_FACTOR,
    });

    insertTableBeforeOriginId(TABLE, $.originId);

    {//タレント選択機能
        const host = new PulldownMenufyHost();
        const DEFAULT_LABEL_NONE = host.DEFAULT_LABEL_NONE;
        const DEFAULT_LABEL = host.DEFAULT_LABEL;
        const createPullDownMenu = host.createPullDownMenu;
        const pulldownMenufy = host.pulldownMenufy;

        const talentsToCreate = ["reload", "medic", "duplicator", "poison", "CPoison", "summoner", "luck", "pHealth"];

        const pullDownMenu = talentsToCreate.map(talent => {
            const rarities = window.florr.database.talentRarity[talent];
            const labels = [DEFAULT_LABEL_NONE, ...rarities.map(r => DEFAULT_LABEL[r])];
            return createPullDownMenu(labels);
        });

        {//見出し
            const H5 = document.createElement("h5");
            H5.textContent = "タレントを選択"
            TABLE.before(H5);
        }
        {//選択
            const SECTION = document.createElement("section");
            SECTION.classList.add("talents");

            talentsToCreate.forEach((talent, i) => {
                const DIV = document.createElement("div");
                const LABEL = document.createElement("label");
                LABEL.textContent = `${window.florr.database.talentName.JP[talent]}（${window.florr.database.talentName.EN[talent]}）`;

                DIV.appendChild(LABEL);
                DIV.appendChild(pullDownMenu[i]);
                SECTION.appendChild(DIV);
            });
            TABLE.before(SECTION);
        }
        {//プルダウンメニュー化
            const updateTable = (talentName, v) => {
                TALENTS_FACTOR[talentName] = TALENTS_FACTOR_DEFAULT[talentName] + (TALENTS_VAL[talentName][v] ?? 0);
                TABLE.updateWhole();
            }
            talentsToCreate.forEach((talent, i) => pulldownMenufy(pullDownMenu[i], v => updateTable(talent, v)));
        }
    }
}
