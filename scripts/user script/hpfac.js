'use strict'

export function main() {

 const element = document.getElementById("mobhealthfactor");
 const factorArr = window.florr.database.mobHealthFactor;
 console.log(window.florr.rarity);
 factorArr.forEach((factor, rID) => {
   const cell = document.createElement("div");
   cell.textContent = `${ window.florr.rarity.name[window.florr.rarity.id[rID.toString()]] } : ${factor}`;
   element.appendChild(cell);
 });

}