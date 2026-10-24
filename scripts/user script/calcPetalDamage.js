const PHTalent = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10];
const PHMulti = 1.15;

/**
 * @param { HTMLTableRowElement } row
 * @param { string } text
*/
function addLeftTHCell(row, text) {
  const th = document.createElement("th");
  th.textContent = text;
  row.appendChild(th);
}

function createTable(array, containerId, hitsArray) {
  const Rarity = ["なし", "Cm", "Un", "Re", "Ep", "Lg", "My", "Ul", "Sp", "Uq"];
  const cCount = Rarity.length;
  const table = document.createElement("table");
  table.border = "1";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  addLeftTHCell(headerRow, "Petal Health");
  for (let i = 0; i < cCount; i++) {
    const th = document.createElement("th");
    th.textContent = Rarity[i];
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);

  const hitRow = document.createElement("tr");
  addLeftTHCell(hitRow, "ヒット数");
  for (let i = 0; i < cCount; i++) {
    const td = document.createElement("td");
    const content = (hitsArray[i] ?? "-") + " hits"
    td.textContent = content;
    hitRow.appendChild(td);
  }
  tbody.appendChild(hitRow);

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
    const PetalDmg = document.getElementById("PetalDamage").value;
    const MobDmg = document.getElementById("MobDamage").value;
    const MobArmor = document.getElementById("MobArmor").value;
    const BasePetalArmor = document.getElementById("PetalArmor").value;
    const TotalDmgLine = [];
    const HitsLine = [];
    for (let i in PHTalent) {
    const PetalHP = document.getElementById("PetalHealth").value * (PHMulti ** PHTalent[i]);
    let NowHP = PetalHP;
    let TotalDmg = 0;
    let Hits = 0;
    let PetalArmor = BasePetalArmor

    if (MobDmg <= 0) break;

    while (NowHP > 0) {
      Hits++;
      TotalDmg += Math.max((PetalDmg * NowHP / PetalHP) - MobArmor, 0);
      NowHP -= Math.max(MobDmg - PetalArmor, 0);
      PetalArmor = PetalArmor / 2;

      if (Hits >= 200) break;
    }
    TotalDmg = Math.round(TotalDmg * 100) / 100;
    TotalDmgLine.push(TotalDmg);
    HitsLine.push(Hits)
  }
  console.log(HitsLine)
  createTable(TotalDmgLine, "table", HitsLine);
}

export const main = () => {
  const wrapper = document.getElementById("petalDamageCalculator");
  if (!wrapper) return;

  wrapper.innerHTML = `
  <label>ペタルダメージ<input type="number" id="PetalDamage" value="30618"></label><br>
  <label>ペタルHP<input type="number" id="PetalHealth" value="21870"></label><br>
  <label>モブダメージ<input type="number" id="MobDamage" min="0" value="7290"></label><br>
  <label>モブアーマー<input type="number" id="MobArmor" value="583"></label><br>
  <label>ペタルアーマー<input type="number" id="PetalArmor" value="21870"></lavel><br>
  <button>計算する</button>
  <div id="table"></div>`;
  wrapper.querySelector("button").addEventListener("click", calcDamage);

  calcDamage();
}