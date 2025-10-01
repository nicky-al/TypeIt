import { texts } from "./typing.js";

const inputE1 = document.querySelector(".input");
const sentenceContain = document.querySelector(".sentences");

const timerE1 = document.querySelector(".timer");
const errorE1 = document.querySelector(".errorE1");

const start = document.querySelector(".start");
const reset = document.querySelector(".reset");
const change = document.querySelector(".switch");

const table = document.querySelector("table");

const modalSection = document.querySelector(".modalSection");
const closeWelcome = document.querySelector(".closeModal");
const openModal = document.querySelector(".openModal");

if (openModal) {
    openModal.addEventListener("click", () => {
        modalSection.classList.remove("hideModal");
    });
}

const reportForm = document.querySelector(".reportsForm"); // fixed selector
const closeReport = document.querySelector(".reportsForm .closeModal");
const reportBtn = document.querySelector(".fa-bug"); // optional if you add one

let paused = true;
let seconds = 60;

let index = 0;
let errors = 0;
let correct = 0;
let wordCount = 0;
let guideIndex = 0;

let span;
let timeInterval;

// Start button
start.addEventListener("click", () => {
    inputE1.focus();
    if (paused) {
        paused = false;
        start.style.opacity = 0.5;
        change.style.opacity = 0.5;
        timer();
        sentenceContain.querySelectorAll("span")[0].className = "input";
    }
});

// Reset button
reset.addEventListener("click", () => {
    if (!paused) {
        resetGame();
    }
});

// Switch button
change.addEventListener("click", () => {
    if (paused) {
        sentenceContain.innerHTML = "";
        randomText();
    }
});

// Always keep input focused while game is active
document.addEventListener("click", () => {
    if (!paused) {
        inputE1.focus();
    }
});

// Close modal
if (closeWelcome) {
    closeWelcome.addEventListener("click", () => {
        modalSection.classList.add("hideModal");
    });
}

// Close modal when pressing ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalSection.classList.contains("hideModal")) {
        modalSection.classList.add("hideModal");
    }
});

// Bug report toggle
if (reportBtn) {
    reportBtn.addEventListener("click", () => {
        reportForm.classList.add("showReport");
    });
}
if (closeReport) {
    closeReport.addEventListener("click", () => {
        reportForm.classList.remove("showReport");
    });
}

// Generate random text
function randomText() {
    const randomNum = Math.floor(Math.random() * texts.length);
    texts[randomNum]
        .toLowerCase()
        .split("")
        .forEach((txt) => {
            sentenceContain.innerHTML += `<span>${txt}</span>`;
        });
}

function checkInput() {
    inputE1.addEventListener("input", (e) => {
        span = sentenceContain.querySelectorAll("span");
        const inputs = e.target.value.split("");

        if (inputs[index] == span[index].innerText) {
            span[index].style.color = "#0b4709"; // green
            correct++;
        } else {
            span[index].style.color = "#47090c"; // red
            errors++;
            errorE1.textContent = `Errors: ${errors}`;
        }

        // Prevent backspace globally
        document.onkeydown = (event) => {
            if (event.key == "Backspace") {
                event.preventDefault();
                return false;
            } else if (event.key == " ") {
                wordCount++;
            }
        };

        index++;
        if (inputs.length < span.length) {
            addGuide();
            removeGuide();
        } else if (inputs.length == span.length) {
            renderRecord();
            resetGame();
        }
    });
}
randomText();
checkInput();

function timer() {
    if (!paused) {
        timeInterval = setInterval(() => {
            seconds--;
            timerE1.textContent = `Time: ${seconds}s`;

            if (seconds == 0) {
                renderRecord();
                resetGame();
            }
        }, 1000);
    }
}

function renderRecord() {
    document.querySelector(".notice").innerHTML = "";
    let accuracy = Math.floor((correct / span.length) * 100);

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${errors}</td>
        <td>${accuracy}%</td>
        <td>${wordCount * 2} WPM</td>
    `;
    table.appendChild(tr);
}

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

function addGuide() {
    if (!paused) {
        guideIndex++;
        span[guideIndex].className = "input";
    }
}

function removeGuide() {
    if (!paused) {
        span[guideIndex - 1].className = "";
    }
}
