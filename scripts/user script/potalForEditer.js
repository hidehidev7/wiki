"use strict";

const BaseTypes = class {//petal,mob,mapのプロパティを持つオブジェクトを作成
    constructor(petal, mob, map) { Object.assign(this, { petal, mob, map }) }
}

const MODIFIED_DATE = new BaseTypes([], [], []);//更新日時格納用
const PAGE = new BaseTypes(
    [//ペタル
        "Basic",
        "Light",
        "Rock",
        "Rose",
        "Stinger",
        "Bubble",
        "Wing",
        "Peas",
        "Faster",
        "Sand",
        "Ant Egg",
        "Beetle Egg",
        "Rice",
        "Corn",
        "Cactus",
        "Claw",
        "Shell",
        "Cutter",
        "Jelly",
        "Soil",
        "Grapes",
        "Clover",
        "Air",
        "Light Bulb",
        "Lotus",
        "Bone",
        "Carrot",
        "Plank",
        "Dark Mark",
        "Tomato",
        "Cotton",
        "Blood Stinger",
        "Rubber",
        "Root",
        "Bur",
        "Ankh",
        "Square",
        "Dice",
        "Talisman of Evasion",
        "Battery",
        "Amulet",
        "Disc",
        "Shovel",
        "Salt",
        "Leaf",
        "Yucca",
        "Pincer",
        "Web",
        "Dandelion",
        "Pollen",
        "Missile",
        "Iris",
        "Lightning",
        "Starfish",
        "Pearl",
        "Dahlia",
        "Sponge",
        "Fang",
        "Orange",
        "Poo",
        "Relic",
        "Magnet",
        "Honey",
        "Yin Yang",
        "Heavy",
        "Antennae",
        "Uranium",
        "Powder",
        "Mysterious Stick",
        "Yggdrasil",
        "Basil",
        "Third Eye",
        "Compass",
        "Coin",
        "Poker Chip",
        "Card",
        "Glass",
        "Privet Berry",
        "Corruption",
        "Moon",
        "Mana Orb",
        "Magic Stinger",
        "Magic Cotton",
        "Blueberries",
        "Magic Leaf",
        "Magic Missile", 
        "Magic Eye",
        "Magic Stick",
        "Magic Cactus",
        "Coral",
        "Magic Bubble",
        "Nazar Amulet",
        "Mimic",
        "Fragment",
        "Mjölnir",
        "Mecha Missile",
        "Wax",
        "Golden Leaf",
        "Cogwheel",
        "Monstera",
        "Mecha Antennae", //祝100種！
        "Laser",
        "Domino",
        "Bandage",
        "Pharaoh's Crown",
        "Totem",
        "Triangle",
        "Electric Web",
        "Blood Sacrifice",
        "Sawblade",
        "Clay",
        "Dust",
        "Broccoli",
        "Lentil",
        "Soul Splitter"
    ],
    [//モブ
        "Flower",
        "Ant Hole",
        "Ant Egg",
        "Baby Ant",
        "Soldier Ant",
        "Queen Ant",
        "Ladybug",
        "Ladybug2",
        "Hornet",
        "Centipede",
        "Evil Centipede",
        "Rock",
        "Bee",
        "Bumble Bee",
        "Spider",
        "Dandelion",
        "Digger",
        "Square",
        "Fire Ant Burrow",
        "Fire Ant Egg",
        "Baby Fire Ant",
        "Worker Fire Ant",
        "Soldier Fire Ant",
        "Ladybug3",
        "Beetle",
        "Desert Centipede",
        "Scorpion",
        "Sandstorm",
        "Cactus",
        "Crab",
        "Starfish",
        "Jellyfish",
        "Leech",
        "Shell",
        "Sponge",
        "Bubble",
        "Fly",
        "Roach",
        "Moth",
        "Queen Fire Ant",
        "Baby Termite",
        "Worker Termite",
        "Soldier Termite",
        "Termite Overmind",
        "Hel Beetle",
        "Bush",
        "Mantis",
        "Leafbug",
        "Termite Mound",
        "Wasp",
        "Firefly",
        "Hel Spider",
        "Magic Firefly",
        "Nazar Beetle",
        "Worm",
        "Mecha Flower",
        "Mecha Wasp",
        "Mecha Spider",
        "Gambler",
        "Trader",
        "Oracle",
        "Titan",
        "Target Dummy",
        "Assembler",
        "Barrel",
        "Mummy Beetle",
        "Tomb",
        "Pharaoh Beetle",
        "Silverfish",
        "Garbage"
    ],
    [//マップ
        "Garden",
        "Desert",
        "Ocean",
        "Jungle",
        "Ant Hell",
        "Sewers",
        "Hel",
        "Factory",
        "pyramid",
    ]
);

const createNewLine = (latest = [], old = []) => {
    const TR = document.createElement("tr");

    const insertNewElm = (type, content, status) => {
        const TD = document.createElement("td");
        TD.style = "text-align: center;";

        switch (type) {
            case "link": {
                if (status === undefined) {
                    const A = document.createElement("a");
                    A.href = `../wiki/${content}`;
                    A.textContent = content;

                    TD.appendChild(A);
                } else {
                    TD.textContent = `${content}: ${status}エラー`;
                    TD.style.color = "#ff0000";
                }
                TR.appendChild(TD);

                break;
            }
            case "date": {
                TD.textContent = content;
                TR.appendChild(TD);

                break;
            }

            default: break;
        }

        return undefined;
    };

    insertNewElm("link", latest[1], latest[2]);
    insertNewElm("date", latest[0]);
    insertNewElm("link", old[1], old[2]);
    insertNewElm("date", old[0]);

    return TR;
}
const getModifiedDate = async o => {
    const LOAD = document.getElementById(`loading:${o.type}`)
    {
        LOAD.textContent = `読み込み中... ${o.i}/${o.length}`;
        LOAD.style.backgroundPositionX = `${(o.i / o.length) * -100}%`;
    }
    const RES = await fetch(`../wiki/${o.name}`);
    if (Math.floor(RES.status / 100) === 2) {//ステータスコード2xx
        if (RES.url === `https://newflorrio.wiki.fc2.com/?cmd=edit&page=${o.name}`) {
            return ["-", o.name, 404];
        } else {
            const TEXT = await RES.text();
            const DOM = new DOMParser().parseFromString(TEXT, "text/html");
            const DATE = DOM.getElementsByClassName("modify_date")[0].textContent;

            return [DATE.replace(/\s/g, "").slice(5, 15), o.name];
        }
    } else return ["-", o.name, RES.status]
}
const createLoadButton = o => {
    switch (o.type) {
        case "create":
            const TH = document.createElement("th");
            TH.colSpan = 4;
            TH.textContent = "＋すべて表示";
            TH.id = `loadMore:${o.pageType}`;
            TH.style.cursor = "pointer";
            return TH;
        case "replace":
            o.elm.textContent = o.replaceType
                ? "▲表示を減らす"
                : "＋すべて表示";
            break;

        default: break;
    }

    return undefined;
}
const main = async pageType => {//メインの動作
    {//読込み中の表示
        const PARENT = document.getElementById(pageType).getElementsByTagName("tbody")[0];
        const TR = document.createElement("tr");
        {
            const TD = document.createElement("td");
            TD.id = `loading:${pageType}`;
            TD.style.textAlign = "center";
            TD.colSpan = 4;
            TD.textContent = "読み込み中...";
            TD.style.background = "linear-gradient(to right, var(--c-subTheme_dark) 50%, var(--c-subTheme_light) 50%)";
            TD.style.backgroundPositionX = "0%";
            TD.style.backgroundSize = "200%";
            TD.style.transition = "background-position .2s ease-out";

            TR.appendChild(TD);
        }
        PARENT.appendChild(TR);
    }
    {//fetchによる更新日時の取得
        const PAGE_LEN = PAGE[pageType].length;
        for (var i = 0; i < PAGE_LEN; i++) {
            const DATA_SET = await getModifiedDate({
                type: pageType,
                name: PAGE[pageType][i] + (
                    pageType === "mob"
                        ? " (mob)"
                        : ""
                ),
                i,
                length: PAGE_LEN
            });
            MODIFIED_DATE[pageType].push(DATA_SET);
        }
    }
    const LEN = MODIFIED_DATE[pageType].length;
    const PARENT = document.getElementById(pageType).getElementsByTagName("tbody")[0];
    {//更新日時のセル挿入
        const TR = PARENT.getElementsByTagName("tr");
        TR[TR.length - 1].remove();

        MODIFIED_DATE[pageType].sort();
        if (LEN > 20) {//長さが20以上なら畳んで表示
            for (let i = 0; i < 10; i++) {
                PARENT.append(
                    createNewLine(MODIFIED_DATE[pageType][LEN - i - 1], MODIFIED_DATE[pageType][i])
                );
            }
            PARENT.append(
                createLoadButton({
                    type: "create",
                    pageType
                })
            );
        } else {
            let i;
            for (i = 0; i < Math.floor(LEN / 2); i++) {
                PARENT.append(
                    createNewLine(MODIFIED_DATE[pageType][LEN - i - 1], MODIFIED_DATE[pageType][i])
                );
            }
            if (LEN % 2 === 1) PARENT.append(
                createNewLine(MODIFIED_DATE[pageType][LEN - i - 1], "")
            );
        }
    }
    {//ボタンが押されたら展開/格納
        let button = document.getElementById(`loadMore:${pageType}`);
        let status = false;
        let i;

        button.addEventListener("click", () => {
            status = !status;

            createLoadButton({
                type: "replace",
                pageType: "",
                elm: button,
                replaceType: status
            });
            if (status) {
                for (i = 10; i < Math.floor(LEN / 2); i++) {
                    button.before(createNewLine(MODIFIED_DATE[pageType][LEN - i - 1], MODIFIED_DATE[pageType][i]));
                }
                if (LEN % 2 === 1) button.before(createNewLine(MODIFIED_DATE[pageType][LEN - i - 1], ""));
            } else {
                for (i = PARENT.getElementsByTagName("tr").length - 2; 10 < i; i--) {
                    PARENT.getElementsByTagName("tr")[i].remove();
                }
            }
        });
    }
}

main("petal");
main("mob");
main("map");
