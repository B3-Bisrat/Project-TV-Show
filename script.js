//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root"); // finds the div
  // Clear the page
  rootElem.innerHTML = "";

  // Loop through every episode
  for (const episode of episodeList) {
    const card = document.createElement("section");

    const title = document.createElement("h2");
    title.textContent = episode.name;

    const code = document.createElement("p");
    code.textContent = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number,
    ).padStart(2, "0")}`;

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = episode.name;

    const summary = document.createElement("div");
    summary.innerHTML = episode.summary;

    card.append(title);
    card.append(code);
    card.append(image);
    card.append(summary);

    rootElem.append(card);
  }

  // TVMaze credit
  const credit = document.createElement("p");
  credit.innerHTML =
    'Data originally from <a href="https://www.tvmaze.com" target="_blank">TVMaze.com</a>';

  rootElem.append(credit);
}

window.onload = setup;
