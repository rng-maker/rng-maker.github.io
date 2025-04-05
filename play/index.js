const p = new URLSearchParams(window.location.search || "?");

let game = {};
let click = new Audio("../assets/click.wav");

if (!p.has("data")) window.location = "/";
try {
    game = JSON.parse(atob(p.get("data")));
} catch {
    alert("Invalid game data, redirecting...");
    window.location = "/";
};

// Initalization
const totalChance = game.options.reduce((sum, item) => sum + item.chance, 0);

document.getElementById("title").textContent = game.title || "RNG game";
document.getElementById("collectionModalLabel").textContent = `Collection for ${game.title || "RNG game"}`;

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
};

function weightedRandom() {
    const random = Math.floor(Math.random() * totalChance);

    let total = 0;
    for (const item of game.options) {
        total += item.chance;
        if (random < total) {
            return item;
        };
    };
};

function renderCollectionItem(item) {
    let option = game.options.find(o => o.index == item.index);
    if (!option) return;
    if (document.getElementById(`item-${item.index}`)) document.getElementById(`item-${item.index}`).remove();

    document.getElementById("no-collection").hidden = true;

    let e = document.createElement("div");
    e.id = `item-${item.index}`;
    e.className = "card mb-3 w-100";
    e.style.width = "18rem";
    e.innerHTML = `<div class="card-body">
                        <h5 class="card-title">${option.label}</h5>
                        <p class="card-text">Chance: ${option.chance}/${totalChance}</p>
                        <p class="card-text">Quantity: ${item.amount}</p>
                    </div>`;

    document.querySelector(".modal-body").appendChild(e);
};

function addToCollection(option) {
    let ct = localStorage.getItem(`collection-${game.id}`);

    if (!ct || typeof ct != "string" || !ct.startsWith("{") || !ct.endsWith("}")) ct = "{}";

    try {
        let cd = JSON.parse(ct);
        let item = cd[option.index] || { index: option.index, amount: 0 };

        item.amount++;
        cd[option.index] = item;

        localStorage.setItem(`collection-${game.id}`, JSON.stringify(cd));
        renderCollectionItem(item);
    } catch (err) { alert(err) };
};

// Pre-populate collection if exists
if (localStorage.getItem(`collection-${game.id}`)) {
    let ct = localStorage.getItem(`collection-${game.id}`);

    try {
        let cd = JSON.parse(ct);
        Object.entries(cd).forEach(([n, v]) => { renderCollectionItem(v) });
    } catch (err) { alert(err) };
};

// Fun
document.getElementById("roll").addEventListener("click", async () => {
    let result;

    document.getElementById("roll").disabled = true;
    document.getElementById("roll").classList.add("disabled");
    document.querySelector(".card").classList.add("shake");

    let rolls = Math.floor(Math.random() * 5) + 5;
    for (let i = 0; i < rolls; i++) {
        let item = weightedRandom();
        result = item;

        document.getElementById("name").textContent = `${item.label}`;
        document.getElementById("description").textContent = `${item.chance}/${totalChance}`;

        click.currentTime = 0;
        click.play();

        await wait(Math.floor(50 * i));
    };

    addToCollection(result);

    document.getElementById("roll").disabled = false;
    document.getElementById("roll").classList.remove("disabled");
    document.querySelector(".card").classList.remove("shake");
});

document.getElementById("share").addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
});

document.getElementById("edit").addEventListener("click", () => {
    window.location = `/?data=${p.get("data")}`;
});

document.getElementById("clear-collection").addEventListener("click", () => {
    if (confirm("Are you sure you want to PERMANENTLY clear your collection? This cannot be undone.")) {
        localStorage.removeItem(`collection-${game.id}`);
        history.go();
    };
});

// Cool css stuff
for (let i = 0; i < 10; i++) {
    let e = document.createElement("div");
    e.className = "square";
    document.querySelector(".bg").appendChild(e);
};

document.addEventListener("mousemove", (e) => {
    const squares = document.querySelectorAll(".square");
    const mx = e.clientX;
    const my = e.clientY;

    squares.forEach(square => {
        const rect = square.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - mx;
        const dy = rect.top + rect.height / 2 - my;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < 100) {
            square.classList.add("near");
        } else {
            square.classList.remove("near");
        };
    });
});
