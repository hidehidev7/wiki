/* ----------
mobcode (statustable ver4.3)
---------- */

import { createStatusTable, PulldownMenufyHost, TALENTS_FACTOR_DEFAULT, TALENTS_VAL, insertTableBeforeOriginId } from "./../util/statustable.js"

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

                {
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
                        if (opts.type == "rarity") Fopts.uniqueDatas = options.uniqueDatas ?? options.uniqueRarityNumbers; //後方互換
                        if (opts.type == "unique") Fopts.uniqueDatas = options.uniqueDatas;
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
                    let converted = convertSpecialStatusInto(opts);
                    Fopts = converted.field;
                    Copts = converted.column;
                }

                //補完
                let id = opts.id ?? "special_" + i;
                Copts.fieldId = id;

                specialFieldOptions[id] = Fopts;
                if (!Copts.isHidden) specialColumnOptionsArr.push(Copts);
            }
        }

        //この時点でspecialFieldOptionsとspecialColumnOptionsArrが完成

        let isFieldValid = {}; //そのフィールドが有効な値であるかどうか（表示するかどうかに関係する）。fieldDict設定時に検査して指定。

        //----- fieldOptionsおよび基本オプションから、FieldDictを生成する -----

        $.options.fieldOptions ??= {};

        //レアリティ。ユーザーに上書きされない。
        $.options.fieldOptions["rarity"] = {
            "type": "constant",
            "base": 0,
            "increase": 1,
        };

        isFieldValid["damage"] = !!($.options.fieldOptions.damage || $.options.baseDamage);
        //攻撃力
        $.options.fieldOptions["damage"] ??= {
            "type": "normal",
            "base": $.options.baseDamage ?? 0,
        };

        isFieldValid["health"] = !!($.options.fieldOptions.health || $.options.baseHealth);
        //体力
        $.options.fieldOptions["health"] ??= {
            "type": "health",
            "base": $.options.baseHealth ?? 0,
        };

        $.options.fieldOptions["maxHealth"] ??= {
            "type": "health",
            "base": $.options.baseMaxHealth ?? 0,
        }
        isFieldValid["maxHealth"] = $.options.fieldOptions.maxHealth.base;

        //アーマー
        $.options.fieldOptions["defaultArmor"] ??= {
            "type": "armor",
            "base": window.florr.database.defaultArmor,
        }

        $.options.fieldOptions["uniqueArmor"] ??= {
            "type": "normal",
            "base": $.options.baseArmor ?? 0,
        }

        $.options.fieldOptions["finalArmor"] ??= {
            "type": "FplusF",
            "baseFieldId": "defaultArmor",
            "secondBaseFieldId": "uniqueArmor",
        }

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

        let damageIsHidden;
        let healthIsHidden;
        let poisonIsHidden;
        let maxHealthIsHidden;

        damageIsHidden = !(isFieldValid["damage"]);
        healthIsHidden = !(isFieldValid["health"]);
        maxHealthIsHidden = !(isFieldValid["maxHealth"]);
        poisonIsHidden = !(isFieldValid["poison"]);

        //ここまで、入力オプションの仕様に依存
        //これ以降、field系の入力されたオプションの使用を禁止

        //-----ColumnArrを生成する -----
        $.options.columnOptions ??= {}; //ユーザー指定可

        $.options.columnOptions.rarity = {
            "name": "レアリティ",
            "viewType": "rarity",
            "fieldId": "rarity",
            "width": 95,
        };

        $.options.columnOptions.damage ??= {
            "name": "攻撃力",
            "viewType": "normal",
            "fieldId": "damage",
            "isHidden": damageIsHidden,
        }

        $.options.columnOptions.armor ??= {
            "name": "アーマー値",
            "viewType": "normal",
            "fieldId": "finalArmor",
        }

        $.options.columnOptions.health ??= {
            "name": "体力",
            "viewType": maxHealthIsHidden ? "normal" : "minAndMax",
            "fieldId": "health",
            "secondFieldId": "maxHealth",
            "isHidden": healthIsHidden,
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

        let arr = ["rarity", "damage", "health", "armor", "poison"];
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
}
