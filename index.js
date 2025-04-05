// RNG STUFF
const p = new URLSearchParams(window.location.search || "?");

let game = {
    options: [],
    version: 1,
    title: "",
    id: crypto.randomUUID()
};
let optionIndex = 0; // dont want interference!

function addOption(label = "", chance = "") {
    let e = document.createElement("div");
    let i = optionIndex;
    e.className = "input-group mb-3";
    e.innerHTML =  `<button class="input-group-text">-</button>
                    <input type="text" class="form-control option-label" placeholder="Label" aria-label="Label" value="${label}">
                    <input type="number" class="form-control option-chance" placeholder="Chance (%)" value="${chance}">`;
    document.getElementById("options").appendChild(e);

    game.options.push({
        element: e,
        label: e.querySelector(".option-label"),
        chance: e.querySelector(".option-chance"),
        index: i
    });
    optionIndex++;

    e.querySelector("button").addEventListener("click", () => {
        game.options = game.options.filter(o => o.index != i);
        e.remove();
        if (game.options.length == 0) document.getElementById("no-options").hidden = false;
    });
};

document.getElementById("add").addEventListener("click", () => {
    document.getElementById("no-options").hidden = true;

    addOption();
});

document.getElementById("even").addEventListener("click", () => {
    if (!game.options || game.options.length == 0) return alert("You can't even out nothing.");
    
    game.options.forEach(o => {
        o.chance.value = `${(100 / game.options.length).toFixed(3)}`;
    });
});

document.getElementById("save").addEventListener("click", () => {
    if (document.getElementById("title").value == "") return alert("Please enter a title.");
    if (!game.options || game.options.length == 0) return alert("Your game is empty, add something before saving.");
    if (game.options.find(o => o.label.value == "" || o.chance.value == "")) return alert("Please fill out all options before saving!");
    
    game.options.forEach(o => {
        o.label = o.label.value;
        o.chance = Number(o.chance.value) || 0;
    });

    game.title = document.getElementById("title").value;
    if (!game.id || game.id == "") game.id = crypto.randomUUID();

    window.location = `/play?data=${btoa(JSON.stringify(game))}`;
});

// goated code not sloppy or inefficient idc
if (p.has("data")) {
    try {
        game = JSON.parse(atob(p.get("data")));
        
        let options = game.options;
        game.options = [];
        
        options.forEach(o => addOption(o.label, o.chance));

        document.getElementById("title").value = `${game.title}`;
        document.getElementById("no-options").hidden = true;
    } catch {
        alert("Invalid editor data, clearing...");
        window.location = "/";
    };
};

// setInterval(() => {
//     let total = 0;
//     game.options.forEach(o => total += Number(o.chance.value) || 0);
//     document.getElementById("tip").textContent = `Tip: Chances should total up to 100% (your total: ${total.toFixed(2)}%) for best results.`;
// }, 500);

// Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

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
