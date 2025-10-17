
const countryContainer = document.getElementById("country-details");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
// This section will provide the saved theme
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
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital");
    if (!res.ok) throw new Error("Error fetching country details");
    const [country] = await res.json();
    console.log(" Country data received:", country.name.common);
    renderCountry(country);
// This section will handle the border countries
    if (country.borders) {
     const borderContainer = document.getElementById("borders");
     const borderPromises = country.borders.map((code) =>
       fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital").then((res) => res.json())
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
// This section renders the country function
 function renderCountry(country) {
  console.log("Rendering country details for:", country.name.common);

  const nativeName =
    country.name.nativeName
      ? Object.values(country.name.nativeName)[0].common
      : country.name.common;

  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name)
        .join(", ")
    : "N/A";

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";
  const capital = country.capital ? country.capital[0] : "N/A";

   countryContainer.innerHTML = `
    <button
      onclick="window.location.href='../../index.html'"
      class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded mb-6 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      ← Back
    </button>

    <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
      <img
        src="${country.flags.svg}"
        alt="Flag of ${country.name.common}"
        class="w-80 h-52 object-cover rounded shadow"
      />
      <div>
        <h2 class="text-2xl font-bold mb-4">${country.name.common}</h2>
        <p><strong>Native Name:</strong> ${nativeName}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Currencies:</strong> ${currencies}</p>
        <div id="borders" class="mt-4 flex flex-wrap gap-2"></div>
      </div>
    </div>
  `;
  console.log(" Finished rendering:", country.name.common);
}

