

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
    if (themeLabel) themeLabel.textContent = "Dark Mode";
});
}

document.addEventListener











