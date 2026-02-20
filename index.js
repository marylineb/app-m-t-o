const input = document.querySelector("input")
const results = document.querySelector(".results")
const weatherCard = document.querySelector(".weather-card")

let allCities = [] // stocke temporairement les résultats de l'API pour filtrage visuel

// 1️⃣ Écoute de la saisie utilisateur
input.addEventListener("input", async () => {
  const value = input.value.trim().toLowerCase()
  results.innerHTML = "" // on vide la liste

  if (value.length < 2) return

  try {
    // Fetch API pour rechercher la ville
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?limit=5&q=${value}`
    )
    const data = await res.json()
    allCities = data.features // stocke pour filtrage visuel

    renderFilteredCities(value)
  } catch (err) {
    results.innerHTML = "<li>Erreur de connexion à l'API</li>"
    console.error(err)
  }
})

// 2️⃣ Filtrage visuel des données
function renderFilteredCities(filter) {
  const filtered = allCities.filter(city =>
    city.properties.label.toLowerCase().includes(filter)
  )

  if (filtered.length === 0) {
    results.innerHTML = "<li>Aucune ville trouvée</li>"
    return
  }

  results.innerHTML = ""
  filtered.forEach(city => {
    const li = document.createElement("li")
    li.textContent = city.properties.label
    li.addEventListener("click", () => {
      loadWeather(city)
      results.innerHTML = "" // vider la liste après sélection
      input.value = city.properties.label
    })
    results.appendChild(li)
  })
}

// 3️⃣ Fonction pour charger la météo
async function loadWeather(city) {
  const [lon, lat] = city.geometry.coordinates
  weatherCard.innerHTML = "<p>Chargement...</p>"

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    )
    const data = await res.json()

    weatherCard.innerHTML = `
      <h3>${city.properties.label}</h3>
      <p>🌡️ ${data.current_weather.temperature}°C</p>
      <p>💨 Vent : ${data.current_weather.windspeed} km/h</p>
      <button id="save-fav">⭐ Ajouter aux favoris</button>
    `

    document.getElementById("save-fav").addEventListener("click", () => {
      saveFavorite(city)
    })
  } catch (err) {
    weatherCard.innerHTML = "<p>Impossible de récupérer la météo</p>"
    console.error(err)
  }
}

// 4️⃣ Gestion des favoris
function saveFavorite(city) {
  const favs = JSON.parse(localStorage.getItem("favorites")) || []

  if (!favs.some(fav => fav.properties.label === city.properties.label)) {
    favs.push(city)
    localStorage.setItem("favorites", JSON.stringify(favs))
    renderFavorites()
  } else {
    alert("Cette ville est déjà dans vos favoris ⭐")
  }
}

function renderFavorites() {
  const favList = document.querySelector(".favorites ul")
  const favs = JSON.parse(localStorage.getItem("favorites")) || []

  favList.innerHTML = ""
  favs.forEach((city, index) => {
    const li = document.createElement("li")
    li.textContent = city.properties.label

    const removeBtn = document.createElement("button")
    removeBtn.textContent = "remove"
    removeBtn.addEventListener("click", () => {
      favs.splice(index, 1)
      localStorage.setItem("favorites", JSON.stringify(favs))
      renderFavorites()
    })

    li.appendChild(removeBtn)
    favList.appendChild(li)
  })
}

// 5️⃣ Initialisation au chargement
document.addEventListener("DOMContentLoaded", renderFavorites)


const liste = [
    {
        date: "aujourd'hui",
        humidité: 1,
        conditionMatin: {icon:"fa-sun-cloud", color:"#FFD43B"},
        conditionSoir: {icon:"fa-moon", color:"#000000ff"},
        temperatureMax: 1,
        temperatureMin: -7,
    },
     {
        date: "mardi",
        humidité: 6,
        conditionMatin: {icon:"fa-cloud", color:"#767573ff"},
        conditionSoir: {icon:"fa-moon-cloud", color:"#000000ff"},
        temperatureMax: 1,
        temperatureMin: -6,
    },
     {
        date: "mercredi",
        humidité: 24,
        conditionMatin: {icon:"fa-cloud-sun", color:"#FFD43B"},
        conditionSoir: {icon:"fa-cloud", color:"#000000ff"},
        temperatureMax: 1, 
        temperatureMin: -2,
    },
     {
        date: "jeudi",
        humidité: 1,
        conditionMatin: {icon:"fa-cloud-hail-mixed", color:"#000000ff"},
        conditionSoir: {icon:"fa-cloud-rain", color:"#000000ff"},
        temperatureMax: 5,
        temperatureMin: 4,
    },
     {
        date: "vendredi",
        humidité: 1,
        conditionMatin: {icon:"fa-cloud-rain", color:"#000000ff"},
        conditionSoir: {icon:"fa-cloud-rain", color:"#000000ff"},
        temperatureMax: 9,
        temperatureMin: 2,
    },
     {
        date: "samedi",
        humidité: 45,
        conditionMatin: {icon:"fa-cloud-rain", color:"#000000ff"},
        conditionSoir: {icon:"fa-cloud", color:"#C4C4C4"},
        temperatureMax: 5,
        temperatureMin: 0,
    },
     {
        date: "dimanche",
        humidité: 1,
        conditionMatin: {icon:"fa-cloud-hail-mixed", color:"#000000ff"},
        conditionSoir: {icon:"fa-cloud-rain", color:"#000000ff"},
        temperatureMax: 7,
        temperatureMin: 5,
    }
]

var ul = document.getElementById("weather-list");
var node = ul.getElementsByClassName("weather-card")[0];

// on retire le template du DOM
ul.removeChild(node);

var deep = true;

for (var i = 0; i < liste.length; i++) {
  var jour = liste[i];

  // 🔁 CLONAGE
  var dupNode = node.cloneNode(deep);

  // remplissage
  dupNode.querySelector(".date").innerText = jour.date;

  var matinIcon = dupNode.querySelector(".matin i");
  matinIcon.classList.add(jour.conditionMatin.icon);
  matinIcon.style.color = jour.conditionMatin.color;

  var soirIcon = dupNode.querySelector(".soir i");
  soirIcon.classList.add(jour.conditionSoir.icon);
  soirIcon.style.color = jour.conditionSoir.color;

  dupNode.querySelector(".max").innerText =
    "🌡️ Max : " + jour.temperatureMax + "°C";
  dupNode.querySelector(".min").innerText =
    "❄️ Min : " + jour.temperatureMin + "°C";
  dupNode.querySelector(".humidity").innerText =
    "💧 Humidité : " + jour.humidité + "%";

  // ajout au DOM
  ul.appendChild(dupNode);
}
