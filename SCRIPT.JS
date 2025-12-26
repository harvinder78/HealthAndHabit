document.getElementById("todayDate").innerText =
  new Date().toLocaleDateString();

const quotes = [
  "Small steps every day lead to big changes.",
  "Your health is your wealth.",
  "Drink more water, your body will thank you.",
  "Consistency is the key to success.",
  "Push harder today if you want a different tomorrow.",
];

function showQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteBox").innerText = quotes[random];
}
showQuote(); // show one on load

function addHabit() {
  const input = document.getElementById("new-habit");
  const value = input.value.trim();
  if (value) {
    const habitList = document.getElementById("habitList");
    const div = document.createElement("div");
    div.className = "habit";
    div.innerHTML = `
          <span>${value}</span>
          <div class="habit-actions">
            <input type="checkbox">
            <button class="delete-btn" onclick="deleteHabit(this)">X</button>
          </div>`;
    habitList.appendChild(div);
    input.value = "";
  }
}

function deleteHabit(btn) {
  btn.parentElement.parentElement.remove();
  updateProgress();
}

function updateProgress() {
  const checkboxes = document.querySelectorAll(
    "#habitList input[type='checkbox']"
  );
  let completed = 0;
  checkboxes.forEach((c) => {
    if (c.checked) completed++;
  });
  const percent = checkboxes.length ? (completed / checkboxes.length) * 100 : 0;
  document.getElementById("progressBar").style.width = percent + "%";
}

document.addEventListener("change", updateProgress);

function incrementStat(id) {
  const el = document.getElementById(id);
  el.innerText = parseInt(el.innerText) + 1;
}

function decrementStat(id) {
  const el = document.getElementById(id);
  let value = parseInt(el.innerText);
  if (value > 0) el.innerText = value - 1;
}

function saveDay() {
  const date = new Date().toLocaleDateString();
  const checkboxes = document.querySelectorAll(
    "#habitList input[type='checkbox']"
  );
  let completed = 0;
  checkboxes.forEach((c) => {
    if (c.checked) completed++;
  });

  const water = document.getElementById("waterCount").innerText;
  const sleep = document.getElementById("sleepCount").innerText;
  const exercise = document.getElementById("exerciseCount").innerText;

  const entry = {
    date,
    completed: `${completed}/${checkboxes.length}`,
    water: `${water} cups`,
    sleep: `${sleep} hrs`,
    exercise: `${exercise} mins`,
  };

  // Get existing history
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(entry);

  // Save back to localStorage
  localStorage.setItem("history", JSON.stringify(history));

  // ================= Streak Logic =================
  let streak = parseInt(localStorage.getItem("streak") || "0");
  let lastDate = localStorage.getItem("lastDate");

  if (lastDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastDate === yesterday.toLocaleDateString()) {
      streak++; // consecutive day
    } else if (lastDate !== date) {
      streak = 1; // reset streak
    }
  } else {
    streak = 1; // first time saving
  }

  localStorage.setItem("streak", streak);
  localStorage.setItem("lastDate", date);

  document.getElementById(
    "streakCounter"
  ).innerText = `🔥 Streak: ${streak} days`;

  // Render updated history
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  const table = document.getElementById("historyTable");
  table.innerHTML = "";

  history.forEach((item) => {
    const row = `<tr>
        <td>${item.date}</td>
        <td>${item.completed}</td>
        <td>${item.water}</td>
        <td>${item.sleep}</td>
        <td>${item.exercise}</td>
      </tr>`;
    table.innerHTML += row;
  });
}

function clearHistory() {
  localStorage.removeItem("history");
  renderHistory();
}

function resetDay() {
  document
    .querySelectorAll("#habitList input[type='checkbox']")
    .forEach((c) => (c.checked = false));
  updateProgress();
  document.getElementById("waterCount").innerText = 0;
  document.getElementById("sleepCount").innerText = 0;
  document.getElementById("exerciseCount").innerText = 0;
}

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});

updateProgress();

// Load streak on refresh
document.addEventListener("DOMContentLoaded", () => {
  let streak = localStorage.getItem("streak") || 0;
  document.getElementById(
    "streakCounter"
  ).innerText = `🔥 Streak: ${streak} days`;

  // Load history
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.forEach((item) => {
    const row = `<tr>
        <td>${item.date}</td>
        <td>${item.completed}</td>
        <td>${item.water}</td>
        <td>${item.sleep}</td>
        <td>${item.exercise}</td>
      </tr>`;
    document.getElementById("historyTable").innerHTML += row;
  });
});
