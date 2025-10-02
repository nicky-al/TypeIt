/* ---- TEMP: inline texts so we remove import issues ---- */
const texts = [
    "In the dreamlike world of Headspace, friends gather under colourful skies, but beneath the cheerful adventures lies a painful truth that Sunny must confront.",
    "The wooden doll steps into dazzling neon halls, where every opponent turns into a musical storm, and dodging waves of light becomes the only way to survive battles that feel like ur ROCKING!",
    "The assassin wakes each day to cryptic instructions, carrying out violent tasks but also questioning what is real and what is memory. Will he save her?",
    "Outlaws ride through wide open prairies, chasing freedom and fortune, yet every gunfight and stolen dollar draws them closer to inevitable betrayal, as loyalty to the gang collides with the creeping weight of modern civilization.",
    "A thick fog wraps the streets, and familiar landmarks twist into distorted shapes, while the radio crackles with static warning, each monster reflecting a deeper guilt, turning the town of Silent Hill into a mirror of fear itself.",
    "With only the Camera Obscura as protection, a shutter's flash captures wandering spirits, their frozen images proof of horrors unseen, forcing the photographer to inch carefully through haunted forests where shadows whisper and sorrow lingers",
];

/* ===== DOM ===== */
const inputE1         = document.querySelector(".input");
const sentenceContain = document.querySelector(".sentences");
const timerE1         = document.querySelector(".timer");
const errorE1         = document.querySelector(".errorE1");
const recordsBody = document.getElementById("recordsBody");

const start  = document.querySelector(".start");
const reset  = document.querySelector(".reset");
const change = document.querySelector(".switch");

const table = document.querySelector("table");

/* Modal */
const modalSection = document.querySelector(".modalSection");
const closeWelcome = document.querySelector(".closeModal");
const openModal    = document.querySelector(".openModal");

/* ===== STATE ===== */
let paused = true;
let seconds = 60;

let index = 0;
let errors = 0;
let correct = 0;
let wordCount = 0;
let guideIndex = 0;

let span; // NodeList of spans
let timeInterval;

/* ===== MODAL ===== */
if (openModal) {
    openModal.addEventListener("click", () => {
        modalSection.classList.remove("hideModal");
    });
}
if (closeWelcome) {
    closeWelcome.addEventListener("click", () => {
        modalSection.classList.add("hideModal");
    });
}
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalSection.classList.contains("hideModal")) {
        modalSection.classList.add("hideModal");
    }
});
window.addEventListener("click", (e) => {
    if (e.target === modalSection) modalSection.classList.add("hideModal");
});

/* ===== GAME CONTROLS ===== */
start.addEventListener("click", () => {
    if (!sentenceContain.firstChild) randomText();

    inputE1.focus();
    if (paused) {
        paused = false;
        start.style.opacity = 0.5;
        change.style.opacity = 0.5;
        timer();

        const firstSpan = sentenceContain.querySelector("span");
        if (firstSpan) firstSpan.className = "input";
    }
});

reset.addEventListener("click", () => {
    if (!paused) resetGame();
});

change.addEventListener("click", () => {
    // Clear out the old sentence
    sentenceContain.innerHTML = "";
    randomText();

    // Reset typing state to start at the first letter
    index = 0;
    errors = 0;
    correct = 0;
    wordCount = 0;
    guideIndex = 0;
    errorE1.textContent = `Errors: 0`;

    // If game is running, keep it live
    if (!paused) {
        inputE1.value = "";
        const firstSpan = sentenceContain.querySelector("span");
        if (firstSpan) firstSpan.className = "input";
        inputE1.focus();
    }
});

/* Keep focus while active */
document.addEventListener("click", () => {
    if (!paused) inputE1.focus();
});

/* Prevent backspace while playing + count words on space */
document.addEventListener("keydown", (event) => {
    if (!paused) {
        if (event.key === "Backspace") {
            event.preventDefault();
            return false;
        }
        if (event.key === " ") {
            wordCount++;
        }
    }
});

/* ===== TEXT / INPUT ===== */
function randomText() {
    const randomNum = Math.floor(Math.random() * texts.length);
    const chars = texts[randomNum].split("");
    sentenceContain.innerHTML = ""; // clear before filling
    for (const ch of chars) {
        sentenceContain.innerHTML += `<span>${ch}</span>`;
    }
}

function checkInput() {
    inputE1.addEventListener("input", (e) => {
        span = sentenceContain.querySelectorAll("span");
        const inputs = e.target.value.split("");

        if (!span.length) return;

        // Safety: if user typed more than text length, bail
        if (index >= span.length) return;

        if (inputs[index] === span[index].textContent) {  // <-- textContent
            span[index].style.color = "#0b4709"; // green
            correct++;
        } else {
            span[index].style.color = "#c82b31"; // red
            errors++;
            errorE1.textContent = `Errors: ${errors}`;
        }

        index++;

        if (index < span.length) {
            addGuide();
            removeGuide();
        } else if (index === span.length) {
            renderRecord();
            resetGame();
        }
    });
}
randomText();
checkInput();

/* ===== TIMER ===== */
function timer() {
    if (!paused) {
        timeInterval = setInterval(() => {
            seconds--;
            timerE1.textContent = `Time: ${seconds}s`;

            if (seconds === 0) {
                renderRecord();
                resetGame();
            }
        }, 1000);
    }
}

/* ===== RECORDS ===== */
function renderRecord() {
    const notice = document.querySelector(".notice");
    if (notice) notice.innerHTML = "";

    const total = span ? span.length : 1;
    const accuracy = Math.max(0, Math.floor((correct / total) * 100));

    const elapsed = 60 - seconds; // seconds spent typing
    const minutes = elapsed > 0 ? elapsed / 60 : 1; // avoid divide by 0
    const wpm = Math.round((index / 5) / minutes);

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${errors}</td>
        <td>${accuracy}%</td>
        <td>${wpm} WPM</td>
    `;
    table.appendChild(tr);
    (recordsBody || table.tBodies[0] || table.createTBody()).appendChild(tr);
}



/* ===== RESET ===== */
function resetGame() {
    inputE1.blur();
    inputE1.value = "";

    paused = true;
    seconds = 60;
    timerE1.textContent = `Time: 60s`;
    clearInterval(timeInterval);

    index = 0;
    errors = 0;
    correct = 0;
    wordCount = 0;
    guideIndex = 0;

    start.style.opacity = 1;
    change.style.opacity = 1;
    errorE1.textContent = `Errors: 0`;

    sentenceContain.innerHTML = "";
    randomText();
}

/* ===== CARET HIGHLIGHT ===== */
function addGuide() {
    if (!paused && span && span[guideIndex + 1]) {
        guideIndex++;
        span[guideIndex].className = "input";
    }
}
function removeGuide() {
    if (!paused && span && span[guideIndex - 1]) {
        span[guideIndex - 1].className = "";
    }
}
