//覚書
////table要素階層構造////
/*/
div#xxx
┗━tbody
  ┣━tr  <-タイトル、画像表示部分
  ┃ ┣━td textContent="Basic..." <-タイトル表示部分
  ┃ ┣━td    <-画像表示部分
  ┃ ┃ ┗━img
  : :
  ┃ ┗━td
  ┃   ┗━img
  : :
  ┣━tr  <-画像サイズ表示部分
  ┃ ┣━td textContent="100 x 100..."
  : :
  ┃ ┗━td textContent="100 x 100..."
  : :
  : :
  以下交互に繰り返し
  : :
  : :
  ┗━tr  <-操作セル部分
    ┣━td  <-矢印表示部分
    ┃ ┗━svg
    :
    ┣━td textContent="ページ1/10..."  <-ページ番号表示部分
    :
    ┗━td  <-矢印表示部分
      ┗━svg
/*/
const rarity = [
    "Cm",
    "Un",
    "Re",
    "Ep",
    "Lg",
    "My",
    "Ul",
    "Sp"
];

const getPageData = () => {
    return new Promise(resolve => {
        fetch("../wiki/データベース")
            .then(res => {
                return res.text();
            })
            .then(text => {
                const dom = new DOMParser().parseFromString(text, "text/html");
                resolve(
                    JSON.parse(
                        `{${dom.querySelectorAll("#database pre")[0].textContent}}`
                    )
                );
            });
    })
}

export const main = async () => {
    const page = await getPageData();
    const tableId = "petalImages";
    const titleCellWidth = document.querySelectorAll(`#${tableId} table tbody`)[0].querySelectorAll("td")[0].style.width
        .replace(/px/, "");
    const linesPerPage = 5;
    const pageLength = Math.ceil(page.petals.length / linesPerPage);
    const baseImgSize = 400;
    const imgSizeTolerance = 0.1;
    const color = {
        lightBG: "#9DE166",
        darkBG: "#80D453",
        grayBG: "#949494",
        tooLarge: "#FF0033",
        tooSmall: "#3333FF",
    }

    const or = (...items) => {
        //or演算
        const orCalc = i => {
            return items[i + 1] == undefined
                ? !(items[i])
                : !(items[i]) && (orCalc(i + 1));
        }
        return !(orCalc(0));
    }
    const styling = (Elm, param) => {
        //プロパティ及びスタイルの指定。引数はオブジェクト形式。
        if (param !== "") {
            if (param.property.length !== 0) {
                for (const property of param.property) {
                    Elm[property[0]] = property[1];
                }
            }
            if (param.style.length !== 0) {
                for (const property of param.style) {
                    Elm.style[property[0]] = property[1];
                }
            }
        }
    }
    const createTd = (childElm, textContent, optionalParam) => {
        //td要素を生成
        console.log(childElm);
        let elm_td = document.createElement("td");
        styling(elm_td, optionalParam);
        elm_td.textContent = textContent;
        elm_td.style.textAlign = "center";
        if (childElm !== "") elm_td.appendChild(childElm);
        return elm_td;
    }
    const createTr = tdContent => {
        //tr要素を生成
        let elm_tr = document.createElement("tr");
        elm_tr.append(tdContent);
        return elm_tr;
    }

    const initializeTable = (parentTable, availableWidth) => {
        for (let i = 0; i < linesPerPage; i++) {
            {//一段目
                //ペタル、モブ、マップ名部分のマス
                let trLine = createTr``;
                {
                    let aElm = document.createElement("a");
                    styling(aElm, {
                        property:
                            [],
                        style:
                            [
                                ["font-weight", "bold"]
                            ]
                    })
                    trLine.appendChild(createTd(aElm, "", {
                        property:
                            [
                                ["rowSpan", 2]
                            ],
                        style:
                            [
                                ["width", availableWidth + "px"],
                                ["height", availableWidth + "px"],
                                ["backgroundColor", color.lightBG]
                            ]
                    }));
                }
                //画像のマス
                for (let j = 0; j < rarity.length; j++) {
                    const imgElm = document.createElement("img");
                    styling(imgElm, {
                        property:
                            [
                                ["loading", "lazy"]
                            ],
                        style:
                            [
                                ["width", availableWidth + "px"]
                            ]
                    })
                    trLine.appendChild(createTd(imgElm, "", {
                        property:
                            [],
                        style:
                            [
                                ["width", availableWidth + "px"],
                                ["height", availableWidth + "px"],
                            ]
                    }));
                }
                parentTable.appendChild(trLine);
            }
            {//二段目
                //画像サイズ表示のマス
                let trLine = createTr``;
                for (let j = 0; j < rarity.length; j++) {
                    trLine.appendChild(createTd("", "-- x --", {
                        property:
                            [],
                        style:
                            [
                                ["backgroundColor", color.grayBG]
                            ]
                    }));
                }
                parentTable.appendChild(trLine);
            }
        }
        //矢印、ページ番号部分
        let trLine = createTr``;
        //左矢印
        trLine.appendChild(createTd("", "◀", {
            property:
                [
                    ["className", "pageDown"],
                    ["colSpan", "2"]
                ],
            style:
                [
                    ["height", availableWidth * 0.6 + "px"],
                    ["cursor", "pointer"],
                    ["backgroundColor", color.lightBG],
                    ["fontSize", availableWidth * 0.6 * 0.5 + "px"]
                ]
        }));
        //ページ番号
        trLine.appendChild(createTd("", "", {
            property:
                [
                    ["className", "pageNum"],
                    ["colSpan", "5"]
                ],
            style:
                [
                    ["backgroundColor", color.lightBG],
                    ["fontWeight", "bold"]
                ]
        }));
        //右矢印
        trLine.appendChild(createTd("", "▶", {
            property:
                [
                    ["className", "pageUp"],
                    ["colSpan", "2"]
                ],
            style:
                [
                    ["cursor", "pointer"],
                    ["backgroundColor", color.lightBG],
                    ["fontSize", availableWidth * 0.6 * 0.5 + "px"]
                ]
        }));
        parentTable.appendChild(trLine);
    }
    const entireUpdate = currentPage => {
        //ページ全体を更新
        const parentElm = document.getElementById(tableId);
        const parentTable = parentElm.getElementsByTagName("tbody")[0];
        for (let i = 1; i <= linesPerPage; i++) {
            for (let j = 0; j <= rarity.length; j++) {
                {//画像のマスを初期化
                    const trElm = parentTable.getElementsByTagName("tr")[2 * i - 1];
                    const tdelm = trElm.getElementsByTagName("td")[j];
                    if (j === 0) {
                        let aElm = tdelm.querySelectorAll("a")[0];
                        aElm.href = "";
                        aElm.textContent = "";
                    } else {
                        const imgElm = tdelm.getElementsByTagName("img")[0];
                        imgElm.src = "";
                        if (page.petals[linesPerPage * currentPage + i - 1] === undefined) {
                            styling(tdelm, {
                                property:
                                    [],
                                style:
                                    [
                                        ["backgroundColor", color.darkBG]
                                    ]
                            });
                            styling(imgElm, {
                                property:
                                    [],
                                style:
                                    [
                                        ["display", "none"]
                                    ]
                            });
                        } else {
                            styling(tdelm, {
                                property:
                                    [],
                                style:
                                    [
                                        ["backgroundColor", "transparent"]
                                    ]
                            });
                            styling(imgElm, {
                                property:
                                    [],
                                style:
                                    [
                                        ["display", "block"]
                                    ]
                            });
                        }
                    }
                }
                {//画像サイズ表示のマスを初期化
                    if (j > 0) {
                        const trElm = parentTable.getElementsByTagName("tr")[2 * i];
                        const tdelm = trElm.getElementsByTagName("td")[j - 1];
                        styling(tdelm, {
                            property:
                                [
                                    ["textContent", "\u202D"]//ダミーとしてLRO制御文字
                                ],
                            style:
                                [
                                    ["backgroundColor", color.darkBG]
                                ]
                        });
                    }
                }
            }
        }
        for (let i = 1; i <= linesPerPage; i++) {
            const trElms = parentTable.getElementsByTagName("tr");
            for (let j = 0; j <= rarity.length; j++) {//画像のマスを更新
                const topTdelm = trElms[2 * i - 1].getElementsByTagName("td")[j];
                if (j === 0) {
                    let aElm = topTdelm.querySelectorAll("a")[0];
                    aElm.href = "../wiki/" + page.petals[linesPerPage * currentPage + i - 1];
                    aElm.textContent = page.petals[linesPerPage * currentPage + i - 1];
                } else {
                    const bottomTdElm = trElms[2 * i].getElementsByTagName("td")[j - 1];
                    const img = topTdelm.getElementsByTagName("img")[0];
                    img.src = `../image/${rarity[j - 1]}_${page.petals[linesPerPage * currentPage + i - 1].replace(/\s+/g, "")}`;
                    if (page.petals[linesPerPage * currentPage + i - 1] === undefined) {
                        styling(topTdelm, {
                            property:
                                [],
                            style:
                                [
                                    ["backgroundColor", color.darkBG]
                                ]
                        });
                        styling(img, {
                            property:
                                [],
                            style:
                                [
                                    ["display", "none"]
                                ]
                        });
                    } else {
                        styling(topTdelm, {
                            property:
                                [],
                            style:
                                [
                                    ["backgroundColor", "transparent"]
                                ]
                        });
                        styling(img, {
                            property:
                                [],
                            style:
                                [
                                    ["display", "block"]
                                ]
                        });
                    }
                    img.addEventListener("load", () => {//画像サイズ表示のマスを更新
                        bottomTdElm.textContent = `${img.naturalWidth} x ${img.naturalHeight}`;
                        styling(bottomTdElm, {
                            property:
                                [],
                            style:
                                [
                                    [
                                        "backgroundColor",
                                        or(
                                            img.naturalWidth - baseImgSize > baseImgSize * imgSizeTolerance,
                                            img.naturalHeight - baseImgSize > baseImgSize * imgSizeTolerance
                                        )
                                            ? color.tooLarge
                                            : or(
                                                img.naturalWidth - baseImgSize < - (baseImgSize * imgSizeTolerance),
                                                img.naturalHeight - baseImgSize < -(baseImgSize * imgSizeTolerance)
                                            )
                                                ? color.tooSmall
                                                : color.lightBG
                                    ]
                                ]
                        })
                    });
                }
            }
            {
                const pageUp = document.querySelectorAll(`#${tableId} .pageUp`)[0];
                const condition = currentPage === pageLength - 1;
                styling(pageUp, {
                    property:
                        [],
                    style:
                        [
                            [
                                "backgroundColor",
                                condition
                                    ? color.darkBG
                                    : color.lightBG
                            ],
                            [
                                "cursor",
                                condition
                                    ? "auto"
                                    : "pointer"
                            ]
                        ]
                });
            }
            {
                const pageDown = document.querySelectorAll(`#${tableId} .pageDown`)[0];
                const condition = currentPage === 0;
                styling(pageDown, {
                    property:
                        [],
                    style:
                        [
                            [
                                "backgroundColor",
                                condition
                                    ? color.darkBG
                                    : color.lightBG
                            ],
                            [
                                "cursor",
                                condition
                                    ? "auto"
                                    : "pointer"
                            ]
                        ]
                });
            }
            const pageNum = document.querySelectorAll(`#${tableId} .pageNum`)[0];
            pageNum.textContent = `ページ${currentPage + 1}/${pageLength}`;
        }
    }
    const resize = (parentElm) => {
        const availableWidth = (parentElm.clientWidth - titleCellWidth - (10 * 2 * 9 + 5 * 10)) / 8;
        const parentTable = parentElm.getElementsByTagName("tbody")[0];
        for (let i = 1; i <= linesPerPage; i++) {
            const trElm = parentTable.getElementsByTagName("tr")[2 * i - 1];
            for (let j = 1; j <= rarity.length; j++) {
                const tdelm = trElm.getElementsByTagName("td")[j];
                styling(tdelm, {
                    property:
                        [],
                    style:
                        [
                            ["width", availableWidth + "px"],
                            ["height", availableWidth + "px"]
                        ]
                });
                const imgElm = tdelm.getElementsByTagName("img")[0];
                styling(imgElm, {
                    property:
                        [],
                    style:
                        [
                            ["width", availableWidth + "px"]
                        ]
                });
            }
        }
        const pageUp = parentTable.getElementsByClassName("pageDown")[0];
        pageUp.style.height = availableWidth * 0.6 + "px";
    }

    const defParentElm = document.getElementById(tableId);
    const defParentTable = defParentElm.getElementsByTagName("tbody")[0];
    const defAvailableWidth = (defParentElm.clientWidth - titleCellWidth - (10 * 2 * 9 + 5 * 10)) / 8;
    initializeTable(defParentTable, defAvailableWidth);
    entireUpdate(0);

    const pageUp = document.querySelectorAll(`#${tableId} .pageUp`)[0];
    const pageDown = document.querySelectorAll(`#${tableId} .pageDown`)[0];
    let currentPage = 0;
    pageUp.addEventListener("click", () => {
        if (currentPage < pageLength - 1) {
            currentPage++;
            entireUpdate(currentPage);
        }
    });
    pageDown.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            entireUpdate(currentPage);
        }
    });
    window.onresize = () => {
        resize(document.getElementById(tableId));
    }
};