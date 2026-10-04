export function main() {

const elm = document.querySelector(".usercode");
const labelElm = document.createElement("label");
labelElm.textContent = "レベル:";
labelElm.htmlFor = "level";
const inputElm = document.createElement("input");
inputElm.type = "number";
inputElm.value = 1;
inputElm.id = "level"
const totalRqXp = document.createElement("span");
totalRqXp.id = "total-required-xp";
const rqXp = document.createElement("span");
rqXp.id = "required-xp";
const elms = [inputElm, totalRqXp, rqXp];
for (let i of elms) {
elm.appendChild(i);
}

const units = [undefined, "k", "m", "b", "t", "qa", "qi", "sx", "sp", "oc", "no", "dc", "ud", "dd", "td", "qua", "qid", "sxd", "spd", "ocd", "nod", "vg", "uvg", "dvg", "tvg", "qavg", "qivg", "scvg", "spvg", "ocvg", "novg"];
function formatNumber(number) {
	let i = 0;
	while ((number >= 1000) && i < (units.length - 1)) {
		number /= 1000;
		i++;
	}
	const unit = units[i];
	if (typeof unit === "string") {
		return (number.toFixed(1) + unit);
	}
	return String(number);
}
function calcRequiredXPForNextLevel(level) {
  if (level === 1) {
	  return 15;
	}
	let base = 0;
	for (let i = 0; i <= 1; i++) {
		base += (20 * Math.floor((level * 2 + i) * 1.05 ** ((level * 2 + i) - 1)));
	}
	const log = (10 ** (Math.trunc(Math.log10(base)) - 1));
	return (Math.round(base / log) * log);
}
function calcTotalRequiredXPForLevel(level) {
	if (level <= 1) {
		return 0;
	}
	let total = 0;
	for (let i = 1; i < level; i++) {
		total += calcRequiredXPForNextLevel(i);
	}
	return total;
}
(() => {
	const requiredXPElement = document.querySelector("#required-xp");
	const totalRequiredXPElement = document.querySelector("#total-required-xp");
	function update() {
		const level = Number(levelElement.value);
		if (typeof level !== "number") {
		return;
	}
	if (!Number.isInteger(level)) {
		return;
	}
	if (level <= 0) {
		return;
	}
	if (level >= 10000) {
		levelElement.value = String(10000);
		return;
	}
	const requiredXP = calcRequiredXPForNextLevel(level);
	requiredXPElement.textContent = (formatNumber(requiredXP) + " " + "(" + requiredXP.toLocaleString("en") + ")");
	const totalRequiredXP = calcTotalRequiredXPForLevel(level);
	totalRequiredXPElement.textContent = (formatNumber(totalRequiredXP) + " " + "(" + totalRequiredXP.toLocaleString("en") + ")");
	}
	const levelElement = document.querySelector("#level");console.log(levelElement );
  levelElement.addEventListener("input", update);
	update();
})();

}