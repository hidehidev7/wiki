export const main = () => {
    const wrapper = document.getElementById("craftChanceCalculator");
    if (!wrapper) return;
    wrapper.innerHTML = ` <p>成功確率：<input type="number" style="width:5em;" id="num_chance_of_crafting" min="0" max="100" list="frequent_chances" step="0.1">%</p>
 <p><input type="button" style="width:7em" value="計算する" id="button_calculate"></p>
 <div style="background-color:khaki; width:100% - 0.4em; margin: 0.2em; padding: 0.2em; color:black;">
   <p id="log_1">計算結果がここに表示されます</p>
 </div>

 <datalist id="frequent_chances">
    <option value="16">
    <option value="8">
    <option value="4">
    <option value="2">
    <option value="1">
</datalist>`;

    const num_chance_of_crafting = document.getElementById("num_chance_of_crafting");
    const button_calculate = document.getElementById("button_calculate");
    const log_1 = document.getElementById("log_1");

    const calculateCost = function (chance) {
        return (1 / chance - 1) * 2.5 + 5;
    }

    const getChanceValue = function () {
        return num_chance_of_crafting.value;
    }

    button_calculate.addEventListener("click", () => {
        log_1.textContent = "平均" + Math.round(10 * calculateCost(getChanceValue() * 0.01)) / 10 + "個必要です";
    });
};