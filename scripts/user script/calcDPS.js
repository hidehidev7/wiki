
export const main = function () {
    const wrapper = document.getElementById("DPSCalculator");
    if(!wrapper) return;
    wrapper.innerHTML = `
 <h2>タレント等</h2>
 <label for="mob-damage-input">Mob Damage:</label>
 <input type="number" id="mob-damage-input" value="10" min="1" step="1" />
 <label for="dupe">Duplicator:</label>
 <input type="checkbox" id="dupe">
 <label for="reload">reload talent:</label>
 <select id="reload">
   <option value="1">none</option>
   <option value="0.917">common</option>
   <option value="0.841">Unusual</option>
   <option value="0.771">Rare</option>
   <option value="0.707">Epic</option>
   <option value="0.648">Legendary</option>
   <option value="0.595">Mythic</option>
   <option value="0.545">Ultra</option>
   <option value="0.5">Super</option>
 </select>
 <label for="rads">Rad/s:</label>
 <input type="number" id="rads" value="4" min="0" step="0.1">
 <h2>選択中のペタル</h2>
 <div id="selected-petal-container"></div>
 総DPS: <span id="total-dps">0</span>
 <h2>ペタルボタン一覧</h2>
 <div id="petal-button-container"></div>`;

    const imageNames = ["basic", "light", "rock", "rose", "stinger", "iris", "wing", "cactus", "faster", "pollen", "dandelion", "heavy", "yin_yang", "leaf", "salt", "rice", "corn", "sand", "pincer", "yucca", "starfish", "pearl", "lightning", "jelly", "claw", "shell", "dahlia", "soil", "fangs", "clover", "orange", "bone", "plank", "blood_stinger", "bur", "dice", "talisman", "coin", "chip", "moon", "glass", "coral", "golden_leaf", "cog", "totem"];

    const petalStats = {
        basic: { damage: 10, health: 10, reload: 2.5 },
        light: { damage: 13, health: 5, reload: 0.8, unit: 5 },
        rock: { damage: 15, health: 45, reload: 4 },
        rose: { damage: 5, health: 5, reload: 3.5 },
        stinger: { damage: 100, health: 2, reload: 10, unit: 5 },
        iris: { damage: 5, health: 5, reload: 4, poison: { damagePerSecond: 23, duration: 3 } },
        wing: { damage: 20, health: 10, reload: 2.5 },
        cactus: { damage: 5, health: 15, reload: 1 },
        faster: { damage: 13, health: 5, reload: 2.5 },
        pollen: { damage: 19, health: 15, reload: 1, unit: 3 },
        dandelion: { damage: 8, health: 8, reload: 1, unit: 3 },
        heavy: { damage: 9, health: 150, reload: 10 },
        yin_yang: { damage: 10, health: 10, reload: 2 },
        leaf: { damage: 13, health: 12, reload: 1.8 },
        salt: { damage: 10, health: 10, reload: 2.5 },
        rice: { damage: 4, health: 1, reload: 0.1 },
        corn: { damage: 5, health: 300, reload: 7 },
        sand: { damage: 20, health: 5, reload: 1.5, unit: 4 },
        pincer: { damage: 5, health: 5, reload: 2.5, poison: { damagePerSecond: 15, duration: 0.75 } },
        yucca: { damage: 5, health: 10, reload: 2.5 },
        starfish: { damage: 5, health: 9, reload: 1.5 },
        pearl: { damage: 15, health: 50, reload: 4 },
        lightning: { damage: 13, health: 0.1, reload: 2.5 },
        jelly: { damage: 10, health: 10, reload: 2.5 },
        claw: { damage: 105, health: 10, reload: 3.5 },
        shell: { damage: 5, health: 25, reload: 3.5 },
        dahlia: { damage: 5, health: 5, reload: 1.5, unit: 3 },
        soil: { damage: 10, health: 10, reload: 2.5 },
        fangs: { damage: 15, health: 10, reload: 3.5 },
        clover: { damage: 10, health: 10, reload: 2.5 },
        orange: { damage: 20, health: 20, reload: 3.5, unit: 3 },
        bone: { damage: 20, health: 10, reload: 2.5 },
        plank: { damage: 10, health: 15, reload: 2.5 },
        blood_stinger: { damage: 100, health: 2, reload: 7.5, unit: 5 },
        bur: { damage: 5, health: 5, reload: 2 },
        dice: { damage: 10, health: 10, reload: 2.5 },
        talisman: { damage: 10, health: 10, reload: 2.5 },
        coin: { damage: 15, health: 10, reload: 2.5 },
        chip: { damage: 5, health: 1, reload: 2.5 },
        moon: { damage: 3, health: 5000, reload: 60 },
        glass: { damage: 15, health: 0, reload: 2.5 },
        coral: { damage: 33, health: 1, reload: 1.5, unit: 6 },
        golden_leaf: { damage: 13, health: 12, reload: 2.5 },
        cog: { damage: 13, health: 13, reload: 2.5 },
        totem: { damage: 10, health: 10, reload: 2.5 },
    };

    const baseURL = "https://raw.githubusercontent.com/Furaken/florr.io/main/image/1_normal/petal/super/";

    const container = document.getElementById("petal-button-container");
    const selectedContainer = document.getElementById("selected-petal-container");
    const totalDpsDisplay = document.getElementById("total-dps");

    const selectedPetals = [];
    let mobDamage = 10;
    let globalReloadModifier = document.getElementById("reload").value;
    let globalRads = document.getElementById("rads").value;
    document.getElementById("mob-damage-input").addEventListener("input", (e) => {
        mobDamage = parseFloat(e.target.value) ?? 1;
        updateDPS(); // ← ペタル選択・パラメータ連動で即再計算
    });
    document.getElementById("reload").addEventListener("input", (e) => {
        globalReloadModifier = parseFloat(e.target.value) ?? 1;
        updateDPS(); // ← ペタル選択・パラメータ連動で即再計算
    });
    document.getElementById("rads").addEventListener("input", (e) => {
        globalRads = parseFloat(e.target.value) ?? 1;
        updateDPS(); // ← ペタル選択・パラメータ連動で即再計算
    });
    document.getElementById("dupe").addEventListener("input", (e) => {
        duped = e.target.checked ? 1 : 0;
        updateDPS(); // ← ペタル選択・パラメータ連動で即再計算
    });

    let duped = 0;

    function calculateDPS({ petalDamage, petalHealth, mobDamage, reload, poison, unit }) {
        const twoPi = 2 * Math.PI;
        const effectiveReload = reload * globalReloadModifier;
        const shotsToDestroy = Math.ceil((petalHealth / unit) / mobDamage); // unitごとの耐久
        const reloadCycles = Math.ceil(effectiveReload * globalRads / twoPi);

        // unit数のダメージ
        const baseDps = ((petalDamage / unit) * globalRads) / twoPi * shotsToDestroy / reloadCycles;
        const dps = (unit >= 2) ? baseDps * (unit + duped) : baseDps

        let poisonDps = 0;

        if (poison) {
            poisonDps = poison.damagePerSecond;
        }

        return dps + poisonDps;
    }

    //描画関連
    function renderSelectedPetals() {
        selectedContainer.innerHTML = "";
        selectedPetals.forEach((petalName, index) => {
            const div = document.createElement("div");
            div.className = "selected-petal";

            const img = document.createElement("img");
            img.src = `${baseURL}${petalName}.png`;
            img.alt = petalName;

            const removeBtn = document.createElement("button");
            removeBtn.className = "remove-button";
            removeBtn.textContent = "×";

            removeBtn.addEventListener("click", () => {
                selectedPetals.splice(index, 1);
                updateDPS();
            });

            div.appendChild(img);
            div.appendChild(removeBtn);
            selectedContainer.appendChild(div);
        });
    }

    function updateDPS() {
        renderSelectedPetals();
        let totalDps = 0;

        selectedPetals.forEach(petalName => {
            const stats = petalStats[petalName];
            if (!stats) return;

            const dps = calculateDPS({
                petalDamage: stats.damage,
                petalHealth: stats.health,
                mobDamage: mobDamage,
                reload: stats.reload,
                poison: stats.poison,
                unit: stats.unit ?? 1
            });

            totalDps += dps;
        });

        totalDpsDisplay.textContent = totalDps.toFixed(2);
    }

    imageNames.forEach(fileName => {
        const btn = document.createElement("button");
        btn.className = "florr-img-button";

        const img = document.createElement("img");
        img.src = `${baseURL}${fileName}.png`;
        img.alt = fileName;

        btn.appendChild(img);
        btn.addEventListener("click", () => {
            selectedPetals.push(fileName);
            updateDPS();
        });

        container.appendChild(btn);
    });
};