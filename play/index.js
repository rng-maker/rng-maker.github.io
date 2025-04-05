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

// Fun
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

document.getElementById("roll").addEventListener("click", async () => {
    document.getElementById("roll").disabled = true;
    document.getElementById("roll").classList.add("disabled");

    let rolls = Math.floor(Math.random() * 5) + 5;
    for (let i = 0; i < rolls; i++) {
        let item = weightedRandom();

        document.getElementById("name").textContent = `${item.label}`;
        document.getElementById("description").textContent = `${item.chance}/${totalChance}`;

        click.currentTime = 0;
        click.play();

        await wait(Math.floor(50 * i));
    };

    document.getElementById("roll").disabled = false;
    document.getElementById("roll").classList.remove("disabled");
});

document.getElementById("share").addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Copied to clipboard!");
});

document.getElementById("edit").addEventListener("click", () => {
    window.location = `/?data=${p.get("data")}`;
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
