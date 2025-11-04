
// These are the element selectors
const countriesDiv  = document.getElementById("countries");
const cardTemplate  = document.getElementById("card-template");
const searchInput   = document.getElementById("search-input");
const regionSelect  = document.getElementById("region-select");
const themeToggle   = document.getElementById("theme-toggle");
const themeLabel    = document.getElementById("theme-label");

let allCountries = [];

// ===== Theme handling =====
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
  if (themeLabel) themeLabel.textContent = "Light Mode";
  console.log("🌙 Dark mode enabled from localStorage");
} else {
  document.documentElement.classList.remove("dark");
  if (themeLabel) themeLabel.textContent = "Dark Mode";
  console.log(" Light mode enabled");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (themeLabel) themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
    console.log(isDark ? " Switched to Dark Mode" : " Switched to Light Mode");
  });
}

// ===== App bootstrap =====
document.addEventListener("DOMContentLoaded", async () => {
  console.log(" DOM fully loaded");
  await loadAllCountries(); // sets allCountries + renders once
});

// ===== Fetch all countries once =====
async function loadAllCountries() {
  try {
    countriesDiv.innerHTML = `
      <div class="flex justify-center py-10">
        <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    `;
    console.log("Fetching all countries from API...");

    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital");
    if (!res.ok) throw new Error("Error fetching data");

    allCountries = await res.json(); 
    console.log(`Successfully fetched ${allCountries.length} countries`);

    displayCountries(allCountries);  
  } catch (error) {
    console.error("Error fetching country data:", error);
    countriesDiv.innerHTML = `<p class="text-red-500 text-center">Failed to load countries 😞</p>`;
  }
}

// ===== Render cards from an array =====
function displayCountries(countries) {
  console.log(` Rendering ${countries.length} country cards`);
  countriesDiv.innerHTML = "";

  countries.forEach((country) => {
    const card = cardTemplate.content.cloneNode(true);

    const link = card.querySelector("a");
    const img  = card.querySelector("img");
    const name = card.querySelector("h2");
    const pop  = card.querySelector(".population");
    const reg  = card.querySelector(".region");
    const cap  = card.querySelector(".capital");

    link.href         = `./src/pages/details.html?name=${encodeURIComponent(country.name.common)}`;
    img.src           = country.flags.png;
    img.alt           = `Flag of ${country.name.common}`;
    name.textContent  = country.name.common;
    pop.textContent   = `Population: ${Number(country.population || 0).toLocaleString()}`;
    reg.textContent   = `Region: ${country.region || "N/A"}`;
    cap.textContent   = `Capital: ${Array.isArray(country.capital) ? country.capital[0] : "N/A"}`;

    countriesDiv.appendChild(card);
  });

  console.log(" Finished rendering all cards");
}

// ===== Search =====
searchInput?.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();
  console.log(" Searching for:", query);

  const filtered = !query
    ? allCountries
    : allCountries.filter((c) => c.name.common.toLowerCase().includes(query));

  console.log(` ${filtered.length} countries match search query`);
  displayCountries(filtered);
});

// ===== Region filter =====
regionSelect?.addEventListener("change", (e) => {
  const region = e.target.value.trim();
  console.log(" Filtering by region:", region || "All regions");

  if (!region) {
    displayCountries(allCountries);
    return;
  }

  const filtered = allCountries.filter(
    (c) => (c.region || "").toLowerCase() === region.toLowerCase()
  );

  console.log(` ${filtered.length} countries found in ${region}`);
  displayCountries(filtered);
});

// Details helpers (kept if you import this same file on details.html) 
async function fetchCountryDetails(name) {
  try {
    console.log(` Fetching detailed info for: ${name}`);
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
    if (!res.ok) throw new Error("Error fetching details");
    const [country] = await res.json();
    console.log(" Received details for:", country.name.common);
    renderCountryDetails(country);

    if (country.borders?.length) {
      const bordersContainer = document.getElementById("borders");
      const url = `https://restcountries.com/v3.1/alpha?codes=${country.borders.join(",")}&fields=name`;
      const br = await fetch(url).then(r => r.json());
      const list = Array.isArray(br) ? br : [br];

      bordersContainer.innerHTML =
        `<strong>Border Countries:</strong> ` +
        list.map(b => {
          const label = b?.name?.common ?? "Unknown";
          return `<button class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  onclick="window.location.href='details.html?name=${encodeURIComponent(label)}'">${label}</button>`;
        }).join(" ");
      console.log(" Rendered border countries");
    } else {
      console.log(" No border countries for this nation");
    }
  } catch (error) {
    console.error(" Error fetching country details:", error);
  }
}

function renderCountryDetails(country) {
  const detailsContainer = document.getElementById("details");
  if (!detailsContainer) return;

  detailsContainer.innerHTML = `
    <button onclick="window.location.href='../../index.html'"
      class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded mb-6 hover:bg-gray-300 dark:hover:bg-gray-600 transition">← Back</button>

    <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="w-80 h-52 object-cover rounded shadow">
      <div>
        <h2 class="text-2xl font-bold mb-4">${country.name.common}</h2>
        <p><strong>Population:</strong> ${Number(country.population || 0).toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region || "N/A"}</p>
        <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
        <p><strong>Capital:</strong> ${Array.isArray(country.capital) ? country.capital[0] : "N/A"}</p>
        <div id="borders" class="mt-4 flex flex-wrap gap-2"></div>
      </div>
    </div>
  `;
}