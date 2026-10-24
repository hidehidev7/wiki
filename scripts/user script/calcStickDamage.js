const STalent = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10];
const SMulti = 1.15

/**
 * @param { HTMLTableRowElement } row
 * @param { string } text
*/
function addLeftTHCell(row, text) {
    const th = document.createElement("th");
    th.textContent = text;
    row.appendChild(th);
}

function createTable(array, containerId) {
    const Rarity = ["なし", "Cm", "Un", "Re", "Ep", "Lg", "My", "Ul", "Sp", "Uq"];
    const cCount = Rarity.length;
    const table = document.createElement("table");
    table.border = "1";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    addLeftTHCell(headerRow, "Summoner");
    for (let i = 0; i < cCount; i++) {
        const th = document.createElement("th");
        th.textContent = Rarity[i];
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);

    const dataRow = document.createElement("tr");
    addLeftTHCell(dataRow, "ダメージ");
    for (let i = 0; i < cCount; i++) {
        const td = document.createElement("td");
        td.textContent = array[i] ?? "-";
        dataRow.appendChild(td);
    }
    tbody.appendChild(dataRow);

    table.appendChild(thead);
    table.appendChild(tbody);

    const container = document.getElementById(containerId);
    container.innerHTML = ""; // 既存内容をクリア
    container.appendChild(table);
}

function calcDamage() {
    const stickRarity = document.getElementById("PetalRarity").value;

    // ------------------------------------
    // if update status change here.
    const ssDmg = 30 * 3 ** stickRarity;
    const ssBaseHP = 30 * 3 ** stickRarity;
    // ------------------------------------

    const MobDmg = document.getElementById("MobDamage").value;
    const MobArmor = document.getElementById("MobArmor").value;
    const TotalDmgLine = [];
    for (let i in STalent) {
        const SHP = ssBaseHP * (SMulti ** STalent[i]);
        let NowHP = SHP;
        let TotalDmg = 0;
        let Hits = 0;

        if (MobDmg <= 0) break; //無限処理対策1

        while (NowHP > 0) {
            Hits++;
            TotalDmg += Math.max(ssDmg - MobArmor, 0);
            NowHP -= MobDmg;
            if (Hits >= 50) break //無限処理対策2
        }
        TotalDmgLine.push(TotalDmg);
    }
    createTable(TotalDmgLine, "table");
}

export const main = () => {
    const wrapper = document.getElementById("stickDamageCalculator");
    if (!wrapper) return;

    wrapper.innerHTML = `<label>Stickレアリティ<select id="PetalRarity">
<option value="3">Epic</option>
<option value="4">Legendary</option>
<option value="5">Mythic</option>
<option value="6">Ultra</option>
<option value="7" selected>Super</option>
<option value="8">Unique</option>
</select></label><br>
<label>モブダメージ<input type="number" id="MobDamage" min="0" value="7290"></label><br>
<label>モブアーマー<input type="number" id="MobArmor" value="583"></label><br>
<button>計算する</button>
<div id="table"></div>`;
    wrapper.querySelector("button").addEventListener("click", calcDamage);

    calcDamage();
}