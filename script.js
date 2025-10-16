// 🎲 dice.js

// ---------------------------------------------------------
// This JavaScript file powers the Dice Roller web app.
// It handles dice rolls, validates input, generates results,
// and updates the UI dynamically.
// ---------------------------------------------------------


// ---------------------------------------------------------
// MAIN FUNCTION: rollDice()
// ---------------------------------------------------------
function rollDice() {

  // --- Collect required HTML elements ---
  const numOfDiceInput = document.getElementById("numOfDice");
  const diceResult = document.getElementById("diceResult");
  const diceImages = document.getElementById("diceImages");

  // Convert input to a number
  const numOfDice = parseInt(numOfDiceInput.value);

  // Arrays to store dice roll results and images
  const values = [];
  const images = [];

  // --- Validate user input ---
  if (isNaN(numOfDice)) {
    displayMessage(diceResult, "⚠️ Please enter a valid number.", "error");
    diceImages.innerHTML = "";
    return;
  }

  if (numOfDice <= 0) {
    displayMessage(diceResult, "⚠️ Number of dice must be greater than 0.", "error");
    diceImages.innerHTML = "";
    return;
  }

  if (numOfDice > 12) {
    displayMessage(diceResult, "⚠️ You can only roll up to 12 dice at a time.", "error");
    diceImages.innerHTML = "";
    return;
  }

  // --- Clear previous results before rolling ---
  diceResult.textContent = "Rolling dice... 🎲";
  diceImages.innerHTML = "";

  // Brief delay to simulate rolling
  setTimeout(() => {

    // --- Perform dice rolls ---
    for (let i = 0; i < numOfDice; i++) {

      // Generate a random number between 1 and 6
      const value = Math.floor(Math.random() * 6) + 1;

      // Store result
      values.push(value);

      // Build the dice image HTML string
      const imageTag = `<img src="dice_images/${value}.png" 
                              alt="Dice ${value}" 
                              class="dice-image">`;
      images.push(imageTag);
    }

    // --- Display results ---
    diceResult.textContent = `🎯 Dice rolled: ${values.join(", ")}`;
    diceImages.innerHTML = images.join("");

    // --- Show stats (sum, average, highest, lowest) ---
    displayStatistics(values, diceImages);

    // --- Save last roll data in local storage ---
    saveLastRoll(values);

  }, 300); // short delay for effect
}


// ---------------------------------------------------------
// HELPER FUNCTION: displayMessage()
// Displays feedback messages to the user
// ---------------------------------------------------------
function displayMessage(element, text, type = "info") {
  element.textContent = text;
  element.className = type; // Use CSS classes like .error or .info
}


// ---------------------------------------------------------
// HELPER FUNCTION: displayStatistics()
// Shows total, average, max, and min dice roll values
// ---------------------------------------------------------
function displayStatistics(values, container) {
  const total = values.reduce((acc, val) => acc + val, 0);
  const average = (total / values.length).toFixed(2);
  const highest = Math.max(...values);
  const lowest = Math.min(...values);

  const stats = document.createElement("div");
  stats.classList.add("dice-stats");
  stats.innerHTML = `
    <p><strong>Total:</strong> ${total}</p>
    <p><strong>Average:</strong> ${average}</p>
    <p><strong>Highest Roll:</strong> ${highest}</p>
    <p><strong>Lowest Roll:</strong> ${lowest}</p>
  `;

  container.appendChild(stats);
}


// ---------------------------------------------------------
// HELPER FUNCTION: saveLastRoll()
// Saves the most recent roll in browser localStorage
// ---------------------------------------------------------
function saveLastRoll(values) {
  localStorage.setItem("lastRoll", JSON.stringify(values));
}


// ---------------------------------------------------------
// HELPER FUNCTION: loadLastRoll()
// Loads previous roll results when page loads (if available)
// ---------------------------------------------------------
function loadLastRoll() {
  const last = localStorage.getItem("lastRoll");
  if (!last) return;

  const diceResult = document.getElementById("diceResult");
  const diceImages = document.getElementById("diceImages");
  const values = JSON.parse(last);

  diceResult.textContent = `🎯 Last roll: ${values.join(", ")}`;
  diceImages.innerHTML = values
    .map(v => `<img src="dice_images/${v}.png" alt="Dice ${v}" class="dice-image">`)
    .join("");
  displayStatistics(values, diceImages);
}


// ---------------------------------------------------------
// Clears all results and stored data
// ---------------------------------------------------------
function resetDice() {
  const diceResult = document.getElementById("diceResult");
  const diceImages = document.getElementById("diceImages");

  diceResult.textContent = "🎲 Ready to roll again!";
  diceImages.innerHTML = "";
  localStorage.removeItem("lastRoll");
}


// ---------------------------------------------------------
// EVENT LISTENER: Automatically load last roll on page start
// ---------------------------------------------------------
window.addEventListener("DOMContentLoaded", loadLastRoll);

// ==========================
// 🌗 THEME TOGGLE FEATURE
// ==========================

// Get toggle button
const themeToggle = document.getElementById("themeToggle");

// Check local storage for theme preference
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  themeToggle.textContent = "🌑 Dark Mode";
}

// Toggle between dark and light
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  const isLight = document.body.classList.contains("light-mode");
  themeToggle.textContent = isLight ? "🌑 Dark Mode" : "🌙 Light Mode";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});
