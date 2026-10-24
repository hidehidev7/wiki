
// -------------------------
// スキルデータ定義
// -------------------------
const skills = [
    { id: "PetalHealth1", name: "Common Petal Health", cost: 2, prereq: [] },
    { id: "PetalHealth2", name: "Unusual Petal Health", cost: 4, prereq: ["PetalHealth1"] },
    { id: "PetalHealth3", name: "Rare Petal Health", cost: 6, prereq: ["PetalHealth2"] },
    { id: "PetalHealth4", name: "Epic Petal Health", cost: 8, prereq: ["PetalHealth3"] },
    { id: "PetalHealth5", name: "Legendary Petal Health", cost: 10, prereq: ["PetalHealth4"] },
    { id: "PetalHealth6", name: "Mythic Petal Health", cost: 12, prereq: ["PetalHealth5"] },
    { id: "PetalHealth7", name: "Ultra Petal Health", cost: 14, prereq: ["PetalHealth6"] },
    { id: "PetalHealth8", name: "Super Petal Health", cost: 16, prereq: ["PetalHealth7"] },
    { id: "PetalHealth9", name: "Unique Petal Health", cost: 18, prereq: ["PetalHealth8"] },
    { id: "Loadout1", name: "Common Loadout", cost: 3, prereq: [] },
    { id: "Loadout2", name: "Unusual Loadout", cost: 6, prereq: ["Loadout1"] },
    { id: "Loadout3", name: "Rare Loadout", cost: 9, prereq: ["Loadout2"] },
    { id: "Loadout4", name: "Epic Loadout", cost: 12, prereq: ["Loadout3"] },
    { id: "Loadout5", name: "Legendary Loadout", cost: 15, prereq: ["Loadout4"] },
    { id: "Duplicator1", name: "Legendary Duplicator", cost: 10, prereq: ["Loadout4"] },
    { id: "Duplicator2", name: "Ultra Duplicator", cost: 20, prereq: ["Duplicator1"] },
    { id: "Duplicator3", name: "Super Duplicator", cost: 30, prereq: ["Duplicator2"] },
    { id: "Duplicator4", name: "Unique Duplicator", cost: 40, prereq: ["Duplicator3"] },
    { id: "Magnetism", name: "Magnetism", cost: 15, prereq: ["Loadout5"] },
    { id: "Antennae1", name: "Rare Antennae", cost: 1, prereq: ["Loadout1"] },
    { id: "Antennae2", name: "Epic Antennae", cost: 3, prereq: ["Antennae1"] },
    { id: "Antennae3", name: "Legendary Antennae", cost: 5, prereq: ["Antennae2"] },
    { id: "Reach1", name: "Rare Reach", cost: 3, prereq: ["Loadout2"] },
    { id: "Reach2", name: "Mythic Reach", cost: 6, prereq: ["Reach1"] },
    { id: "Reach3", name: "Super Reach", cost: 9, prereq: ["Reach2"] },
    { id: "Reload1", name: "Common Reload", cost: 2, prereq: [] },
    { id: "Reload2", name: "Unusual Reload", cost: 5, prereq: ["Reload1"] },
    { id: "Reload3", name: "Rare Reload", cost: 8, prereq: ["Reload2"] },
    { id: "Reload4", name: "Epic Reload", cost: 12, prereq: ["Reload3"] },
    { id: "Reload5", name: "Legendary Reload", cost: 15, prereq: ["Reload4"] },
    { id: "Reload6", name: "Mythic Reload", cost: 18, prereq: ["Reload5"] },
    { id: "Reload7", name: "Ultra Reload", cost: 21, prereq: ["Reload6"] },
    { id: "Reload8", name: "Super Reload", cost: 24, prereq: ["Reload7"] },
    { id: "Reload9", name: "Unique Reload", cost: 27, prereq: ["Reload8"] },
    { id: "PetalRotation1", name: "Common Petal Rotation", cost: 1, prereq: [] },
    { id: "PetalRotation2", name: "Unusual Petal Rotation", cost: 2, prereq: ["PetalRotation1"] },
    { id: "PetalRotation3", name: "Rare Petal Rotation", cost: 3, prereq: ["PetalRotation2"] },
    { id: "PetalRotation4", name: "Epic Petal Rotation", cost: 4, prereq: ["PetalRotation3"] },
    { id: "PetalRotation5", name: "Legendary Petal Rotation", cost: 5, prereq: ["PetalRotation4"] },
    { id: "Health1", name: "Common Health", cost: 2, prereq: [] },
    { id: "Health2", name: "Unusual Health", cost: 5, prereq: ["Health1"] },
    { id: "Health3", name: "Rare Health", cost: 8, prereq: ["Health2"] },
    { id: "Health4", name: "Epic Health", cost: 11, prereq: ["Health3"] },
    { id: "Health5", name: "Legendary Health", cost: 14, prereq: ["Health4"] },
    { id: "Health6", name: "Mythic Health", cost: 17, prereq: ["Health5"] },
    { id: "Health7", name: "Ultra Health", cost: 20, prereq: ["Health6"] },
    { id: "Health8", name: "Super Health", cost: 23, prereq: ["Health7"] },
    { id: "Health9", name: "Unique Health", cost: 26, prereq: ["Health8"] },
    { id: "SecondChance1", name: "Legendary Second Chance", cost: 10, prereq: ["Health3"] },
    { id: "SecondChance2", name: "Mythic Second Chance", cost: 20, prereq: ["SecondChance1"] },
    { id: "Medic1", name: "Common Medic", cost: 2, prereq: [] },
    { id: "Medic2", name: "Unusual Medic", cost: 5, prereq: ["Medic1"] },
    { id: "Medic3", name: "Rare Medic", cost: 8, prereq: ["Medic2"] },
    { id: "Medic4", name: "Epic Medic", cost: 11, prereq: ["Medic3"] },
    { id: "Medic5", name: "Legendary Medic", cost: 14, prereq: ["Medic4"] },
    { id: "Medic6", name: "MythicMedic", cost: 17, prereq: ["Medic5"] },
    { id: "Medic7", name: "Ultra Medic", cost: 20, prereq: ["Medic6"] },
    { id: "Medic8", name: "Super Medic", cost: 23, prereq: ["Medic7"] },
    { id: "Medic9", name: "Unique Medic", cost: 26, prereq: ["Medic8"] },
    { id: "Summoner1", name: "Common Summoner", cost: 2, prereq: [] },
    { id: "Summoner2", name: "Unusual Summoner", cost: 5, prereq: ["Summoner1"] },
    { id: "Summoner3", name: "Rare Summoner", cost: 8, prereq: ["Summoner2"] },
    { id: "Summoner4", name: "Epic Summoner", cost: 11, prereq: ["Summoner3"] },
    { id: "Summoner5", name: "Legendary Summoner", cost: 14, prereq: ["Summoner4"] },
    { id: "Summoner6", name: "Mythic Summoner", cost: 17, prereq: ["Summoner5"] },
    { id: "Summoner7", name: "Ultra Summoner", cost: 20, prereq: ["Summoner6"] },
    { id: "Summoner8", name: "Super Summoner", cost: 23, prereq: ["Summoner7"] },
    { id: "Summoner9", name: "Unique Summoner", cost: 26, prereq: ["Summoner8"] },
    { id: "SharpEdges1", name: "Common Sharp Edges", cost: 2, prereq: [] },
    { id: "SharpEdges2", name: "Unusual Sharp Edges", cost: 3, prereq: ["SharpEdges1"] },
    { id: "SharpEdges3", name: "RareSharp Edges", cost: 4, prereq: ["SharpEdges2"] },
    { id: "SharpEdges4", name: "Epic Sharp Edges", cost: 5, prereq: ["SharpEdges3"] },
    { id: "SharpEdges5", name: "Legendary Sharp Edges", cost: 6, prereq: ["SharpEdges4"] },
    { id: "SharpEdges6", name: "Mythic Sharp Edges", cost: 7, prereq: ["SharpEdges5"] },
    { id: "SharpEdges7", name: "Ultra Sharp Edges", cost: 8, prereq: ["SharpEdges6"] },
    { id: "SharpEdges8", name: "Super Sharp Edges", cost: 9, prereq: ["SharpEdges7"] },
    { id: "BodyToxicity", name: "Body Toxicity", cost: 10, prereq: ["SharpEdges6"] },
    { id: "Luck1", name: "Common Luck", cost: 2, prereq: [] },
    { id: "Luck2", name: "Unusual Luck", cost: 3, prereq: ["Luck1"] },
    { id: "Luck3", name: "Rare Luck", cost: 4, prereq: ["Luck2"] },
    { id: "Luck4", name: "Epic Luck", cost: 5, prereq: ["Luck3"] },
    { id: "Luck5", name: "Legendary Luck", cost: 6, prereq: ["Luck4"] },
    { id: "Luck6", name: "Mythic Luck", cost: 7, prereq: ["Luck5"] },
    { id: "Luck7", name: "Ultra Luck", cost: 8, prereq: ["Luck6"] },
    { id: "Luck8", name: "Super Luck", cost: 9, prereq: ["Luck7"] },
    { id: "Luck9", name: "Unique Luck", cost: 10, prereq: ["Luck8"] },
    { id: "Poison1", name: "Common Poison", cost: 1, prereq: [] },
    { id: "Poison2", name: "Unusual Poison", cost: 2, prereq: ["Poison1"] },
    { id: "Poison3", name: "Rare Poison", cost: 3, prereq: ["Poison2"] },
    { id: "Poison4", name: "Rare Poison", cost: 3, prereq: ["Poison2"] },
    { id: "Poison5", name: "Rare Poison", cost: 3, prereq: ["Poison2"] },
    { id: "Poison6", name: "Rare Poison", cost: 3, prereq: ["Poison2"] },
    { id: "Poison7", name: "Rare Poison", cost: 3, prereq: ["Poison2"] },
    { id: "Poison8", name: "Rare Poison", cost: 3, prereq: ["Poison2"] },
    { id: "Poison9", name: "Rare Poison", cost: 3, prereq: ["Poison2"] },
    { id: "ConcentratedPoison", name: "Concentrated Poison", cost: 15, prereq: ["Poison3"] },
];

// -------------------------
// ツリーをHTMLに変換
// -------------------------
function createTreeHTML(nodes) {
    const ul = document.createElement("ul");
    nodes.forEach(node => {
        const li = document.createElement("li");
        li.innerHTML = `
      <label>
        <input type="checkbox" id="${node.id}">
        <span class="skill-name">${node.name}</span>
        <span class="skill-info">(${node.cost}pt)</span>
      </label>
    `;
        if (node.children.length > 0) {
            const childUl = createTreeHTML(node.children);
            childUl.classList.add("tree-line");
            li.appendChild(childUl);
        }
        ul.appendChild(li);
    });
    return ul;
}


// -------------------------
// 階層構造を作成
// -------------------------
function buildTree(skills) {
    const skillMap = {};
    skills.forEach(s => skillMap[s.id] = { ...s, children: [] });

    const roots = [];
    skills.forEach(skill => {
        if (skill.prereq.length === 0) {
            roots.push(skillMap[skill.id]);
        } else {
            const parentId = skill.prereq[skill.prereq.length - 1];
            if (skillMap[parentId]) skillMap[parentId].children.push(skillMap[skill.id]);
        }
    });
    return roots;
}

// -------------------------
// 前提スキルを再帰的に取得
// -------------------------
function getAllPrereqs(skillId, collected = new Set()) {
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return collected;

    for (const pid of skill.prereq) {
        if (!collected.has(pid)) {
            collected.add(pid);
            getAllPrereqs(pid, collected);
        }
    }
    return collected;
}

// -------------------------
// 依存スキルを再帰的に取得
// -------------------------
function getAllDependents(skillId, collected = new Set()) {
    const dependents = skills.filter(s => s.prereq.includes(skillId));
    for (const dep of dependents) {
        if (!collected.has(dep.id)) {
            collected.add(dep.id);
            getAllDependents(dep.id, collected);
        }
    }
    return collected;
}

export const main = () => {
    {
        const alert = document.querySelector("span.hoge");
        if(alert) alert.remove();
    }

    const wrapper = document.getElementById("talentTree");
    if (!wrapper) return;
    wrapper.innerHTML = `<div id="tree"></div>
 <p><strong>合計TP:</strong> <span id="total">0</span></p>
 <p id="error" class="error"></p>`;

    // -------------------------
    // スキルツリー描画
    // -------------------------
    const treeRoot = buildTree(skills);
    document.getElementById("tree").appendChild(createTreeHTML(treeRoot));

    const totalEl = document.getElementById("total");
    const errorEl = document.getElementById("error");

    // -------------------------
    // チェックイベント処理
    // -------------------------
    document.getElementById("tree").addEventListener("change", e => {
        const id = e.target.id;
        const skill = skills.find(s => s.id === id);
        if (!skill) return;

        if (e.target.checked) {
            // すべての前提スキルを再帰的に確認
            const allPrereqs = [...getAllPrereqs(id)];
            const unmet = allPrereqs.filter(pid => !document.getElementById(pid).checked);

            if (unmet.length > 0) {
                const names = unmet.map(pid => skills.find(s => s.id === pid).name).join(", ");
                if (true) {
                    unmet.forEach(pid => document.getElementById(pid).checked = true);
                } else {
                    e.target.checked = false;
                }
            }

        } else {
            // 外したスキルの依存スキルを再帰的に外す
            const allDependents = [...getAllDependents(id)];
            if (allDependents.length > 0) {
                const names = allDependents.map(did => skills.find(s => s.id === did).name).join(", ");
                allDependents.forEach(did => document.getElementById(did).checked = false);
            }
        }

        updateTotal();
    });

    // -------------------------
    // 合計ポイント計算
    // -------------------------
    function updateTotal() {
        let total = 0;
        skills.forEach(s => {
            if (document.getElementById(s.id).checked) total += s.cost;
        });
        totalEl.textContent = total;
    }
}