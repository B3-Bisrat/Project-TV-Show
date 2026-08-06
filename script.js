//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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

window.onload = setup;

