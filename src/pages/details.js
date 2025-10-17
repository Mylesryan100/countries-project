
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
// Country details are being loaded
document.addEventListener("DOMContentLoaded", async () => {
  console.log(" DOMContentLoaded triggered on details page");
  applySavedTheme();
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  if (!name) {
    countryContainer.textContent = " No country selected.";
    console.warn("No country name found in query string.");
    return;
  }

  try {
    console.log(` Fetching details for: ${name}`);
    const res = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
    if (!res.ok) throw new Error("Error fetching country details");
    const [country] = await res.json();
    console.log(" Country data received:", country.name.common);
    renderCountry(country);

    if (country.borders) {
     const borderContainer = document.getElementById("borders");
     const borderPromises = country.borders.map((code) =>
       fetch(`https://restcountries.com/v3.1/alpha/${code}?fields=name`).then((res) => res.json())
     );

     const borders = await Promise.all(borderPromises);
      borderContainer.innerHTML = `
        <strong>Border Countries:</strong> 
        ${borders
          .map(
            (b) => `
          <button
            class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onclick="window.location.href='details.html?name=${b[0].name.common}'"
           > 
             ${b[0].name.common}
           </button>`
           )
           .join("")}
       `;
       console.log(" Rendered border countries:", borders.map((b) => b[0].name.common).join(", "));
     } else {
       console.log(" No bordering countries found for this nation.");
     }
   } catch (err) {
     console.error(" Error loading country details:", err);
     countryContainer.textContent = "Error loading country details.";
   }
 });

