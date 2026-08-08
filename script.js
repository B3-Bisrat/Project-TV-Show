//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
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
  image.src = episode.image.medium;
  image.alt = episode.name;

  const summary = document.createElement("div");
  summary.innerHTML = episode.summary;

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
        episode.summary.toLowerCase().includes(term)
      );
    });

    makePageForEpisodes(matches);
    countDisplay.textContent = `${matches.length} / ${allEpisodes.length} episodes`;
  });
}

function setupEpisodeSelector(allEpisodes) {
  const selectElem = document.getElementById("episode-select");

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