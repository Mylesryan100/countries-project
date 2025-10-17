
const countryContainer = document.getElementById("country-details");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    if (themeLabel) themeLabel.textContent = "Light Mode";
    console.log("🌙 Dark theme applied from localStorage");
  } else {
    document.documentElement.classList.remove("dark");
    if (themeLabel) themeLabel.textContent = "Dark Mode";
    console.log("☀️ Light theme applied from localStorage");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (themeLabel) themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
    console.log(isDark ? "🌙 Switched to dark mode" : "☀️ Switched to light mode");
  });
}