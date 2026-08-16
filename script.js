let allEpisodes = [];
const episodeCache = {}; // showId -> episodes array
let showsList = [];

function setup() {
  const rootElem = document.getElementById("root");
  rootElem.textContent = "Loading shows...";

  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load shows");
      }
      return response.json();
    })
    .then((shows) => {
      // Sort alphabetically, case-insensitive
      showsList = shows.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
      setupShowSelector(showsList);
      // Load the first show by default (or pick a specific one, e.g. Breaking Bad = 169)
      loadShow(showsList[0].id);
    })
    .catch(() => {
      rootElem.textContent = "Sorry, we could not load the shows list.";
    });
}

function setupShowSelector(shows) {
  const showSelectElem = document.getElementById("show-select");
  showSelectElem.innerHTML = "";
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelectElem.append(option);
  });

  showSelectElem.addEventListener("change", () => {
    loadShow(showSelectElem.value);
  });
}

function loadShow(showId) {
  const rootElem = document.getElementById("root");

  // Reset search box on show switch
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";

  // Use cache if we've already fetched this show's episodes
  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];
    finishLoadingShow();
    return;
  }

  rootElem.textContent = "Loading episodes...";
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load episodes");
      }
      return response.json();
    })
    .then((episodes) => {
      episodeCache[showId] = episodes; // cache it
      allEpisodes = episodes;
      finishLoadingShow();
    })
    .catch(() => {
      rootElem.textContent = "Sorry, we could not load the episodes.";
    });
}

function finishLoadingShow() {
  makePageForEpisodes(allEpisodes);
  setupSearch(allEpisodes);
  setupEpisodeSelector(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  for (const episode of episodeList) {
    rootElem.append(makeEpisodeCard(episode));
  }
  rootElem.append(makeCredit());
}

function makeEpisodeCard(episode) {
  const card = document.createElement("section");
  card.id = `episode-${episode.id}`;
  const title = document.createElement("h2");
  title.textContent = episode.name;
  const code = document.createElement("p");
  code.textContent = formatEpisodeCode(episode);
  const image = document.createElement("img");
  image.src = episode.image ? episode.image.medium : "";
  image.alt = episode.name;
  const summary = document.createElement("div");
  summary.innerHTML = episode.summary || "";
  card.append(title, code, image, summary);
  return card;
}

function formatEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number,
  ).padStart(2, "0")}`;
}

function makeCredit() {
  const credit = document.createElement("p");
  credit.innerHTML =
    'Data originally from <a href="https://www.tvmaze.com" target="_blank">TVMaze.com</a>';
  return credit;
}

function setupSearch(allEpisodes) {
  const searchInput = document.getElementById("search-input");
  const countDisplay = document.getElementById("search-count");
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const matches = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(term) ||
        (episode.summary && episode.summary.toLowerCase().includes(term))
      );
    });
    makePageForEpisodes(matches);
    countDisplay.textContent = `${matches.length} / ${allEpisodes.length} episodes`;
  });
}

function setupEpisodeSelector(allEpisodes) {
  const selectElem = document.getElementById("episode-select");
  selectElem.innerHTML = ""; // reset when switching shows
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode)} - ${episode.name}`;
    selectElem.append(option);
  });
  selectElem.addEventListener("change", () => {
    const target = document.getElementById(`episode-${selectElem.value}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}

window.onload = setup;
