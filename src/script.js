
// These are the element selectors
const countriesDiv = document.getElementById("countries");
const cardTemplate = document.getElementById('card-template')
const searchInput = document.getElementById("search-input");
const regionSelect = document.getElementById("region-select");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");

let allCountries = [];

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital",
  );

  if (!res.ok) {
    throw new Error("Error fetching data");
  }

  const data = await res.json();
  console.log(data);

  data.forEach(country => {
    
    console.log(Array.isArray(country.capital));
    
    // Clone the card template
    const  cardTemplateClone = cardTemplate.content.cloneNode(true);

    // add the page path to the href
    cardTemplateClone.querySelector('a').href = './src/pages/details.html?name=' + country.name.common;

    // add the source and alt text to the image
    cardTemplateClone.querySelector('img').src = country.flags.png;
    cardTemplateClone.querySelector('img').alt = country.name.common;

    
    // add country name to the h2
    cardTemplateClone.querySelector('h2').textContent = country.name.common;
    
    // add population
    cardTemplateClone.querySelector('.population').textContent = `Population: ${country.population}`;

    // add region
    cardTemplateClone.querySelector('.region').textContent = `Region: ${country.region}`

    // add capital
    cardTemplateClone.querySelector('.capital').textContent = `Capital: ${country.capital}`;
    
    countriesDiv.appendChild(cardTemplateClone)
    
  })
});
// This section is for all the functionality for Theme Handling
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark")
  if (themeLabel) themeLabel.textContent = "Light Mode";
} else {
  document.documentElement.classList.add("dark");
  if (themeLabel) themeLabel.textContent = "Dark Mode";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (themeLabel) themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
});
}
// This section is for loading the homepage
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM fully loaded");
  if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
    await loadAllCountries();
  } else if (window.location.pathname.includes("index.html")) {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    if (name) fetchCountryDetails(name);
  }
});
// This sections fetches all countries and their info
async function loadAllCountries() {
  try {
    countriesDiv.innerHTML = `<p class="text-gray-500 text-center"> Loading countries...</p>`;
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
// This section will allow the country cards to be displayed
function displayCountries(countries) {
  console.log(`🧩 Rendering ${countries.length} country cards`);
  countriesDiv.innerHTML = "";

  countries.forEach((country) => {
    console.log("🗺️ Rendering:", country.name.common);
    const card = cardTemplate.content.cloneNode(true);
    const link = card.querySelector("a");
    const img = card.querySelector("img");
    const name = card.querySelector("h2");
    const pop = card.querySelector(".population");
    const reg = card.querySelector(".region");
    const cap = card.querySelector(".capital");
    link.href = `./src/pages/details.html?name=${country.name.common}`;
    img.src = country.flags.png;
    img.alt = `Flag of ${country.name.common}`;
    name.textContent = country.name.common;
    pop.textContent = `Population: ${country.population.toLocaleString()}`;
    reg.textContent = `Region: ${country.region}`;
    cap.textContent = `Capital: ${country.capital ? country.capital[0] : "N/A"}`;
    countriesDiv.appendChild(card);
  });

  console.log(" Finished rendering all cards");
}
// this section is for the search functions functionality
searchInput?.addEventListener("input", (e) => {
  console.log("Searching for:", query);
  const filtered = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(query)
);
console.log(` ${filtered.length} results found`);
displayCountries(filtered);
});