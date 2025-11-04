
const countryContainer =
  document.getElementById("country-details") ||
  document.getElementById("details");
if (!countryContainer) {
  console.error(" details container not found. Add <main id=\"country-details\"> to details.html");
}
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");

// This section will provide the saved theme
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    if (themeLabel) themeLabel.textContent = "Light Mode";
    console.log(" Dark theme applied from localStorage");
  } else {
    document.documentElement.classList.remove("dark");
    if (themeLabel) themeLabel.textContent = "Dark Mode";
    console.log("Light theme applied from localStorage");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (themeLabel) themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
    console.log(isDark ? " Switched to dark mode" : " Switched to light mode");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  applySavedTheme();
// console.log(" DOMContentLoaded triggered on details page");
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  if (!name) {
    countryContainer.textContent = "No country selected.";
    return;
  }

  // spinner
  countryContainer.innerHTML = `
    <div class="flex justify-center py-10">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  `;

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
    if (!res.ok) throw new Error("Failed to fetch country");

    const data = await res.json();           
    const country = data[0];                  
    if (!country) throw new Error("Country not found");

    console.log("Received:", country.name.common); 
    renderCountry(country);                  
    await renderBorderCountries(country);     
  } catch (err) {
    console.error(" Error loading details:", err);
    countryContainer.innerHTML = `<p class="text-center text-red-500 mt-8">Error loading country details.</p>`;
  }
});


// // Country details are being loaded
// document.addEventListener("DOMContentLoaded", async () => {
 
//   applySavedTheme();
//   const urlParams = new URLSearchParams(window.location.search);
//   const name = urlParams.get("name");
//   if (!name) {
//     countryContainer.textContent = " No country selected.";
//     console.warn("No country name found in query string.");
//     return;
//   }

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
 ;
// This section renders the country function
 function renderCountry(country) {
  if (!countryContainer) return;

  const nativeName = (() => {
    const nn = country.name?.nativeName ?? {};
    const first = Object.values(nn)[0];
    return first?.common ?? country.name.common;
  })();

  const currencies = (() => {
    const cur = country.currencies ?? {};
    const list = Object.values(cur);
    return list.length ? list.map(c => `${c.name}${c.symbol ? ` (${c.symbol})` : ""}`).join(", ") : "N/A";
  })();

  const languages = (() => {
    const lang = country.languages ?? {};
    const list = Object.values(lang);
    return list.length ? list.join(", ") : "N/A";
  })();

  const capital = Array.isArray(country.capital) ? country.capital[0] : "N/A";

  countryContainer.innerHTML = `
    <button
      onclick="window.location.href='../../index.html'"
      class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded mb-6 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >← Back</button>

    <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="w-80 h-52 object-cover rounded shadow">
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
}
// ===== borders =====
async function renderBorderCountries(country) {
  const container = document.getElementById("borders");
  if (!container) return;

  const codes = country.borders || [];
  if (codes.length === 0) {
    container.innerHTML = `<strong>Border Countries:</strong> None`;
    return;
  }

  try {
    const results = await Promise.all(
      codes.map(code =>
        fetch(`https://restcountries.com/v3.1/alpha/${code}?fields=name`).then(r => r.json())
      )
    );

    container.innerHTML =
      `<strong>Border Countries:</strong> ` +
      results
        .map(b =>
          `<button
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onclick="window.location.href='details.html?name=${b[0].name.common}'"
            >${b[0].name.common}</button>`
        )
        .join(" ");
  } catch (err) {
    console.error(" Error loading border countries:", err);
    container.innerHTML = `<strong>Border Countries:</strong> <span class="text-red-500">Error loading</span>`;
  }
}
