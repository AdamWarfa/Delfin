import { getResults, getMember } from "./rest-service.js";

async function updateResultsGrid() {
  const listOfResults = await getResults();
  showAllTop5(listOfResults);
}

function showAllTop5(listOfResults) {
  const sortedResults = listOfResults.sort(sortTop5);
  document.querySelector("#front-grid-crawl").innerHTML = "";
  document.querySelector("#front-grid-brystsvømning").innerHTML = "";
  document.querySelector("#front-grid-butterfly").innerHTML = "";
  document.querySelector("#front-grid-rygcrawl").innerHTML = "";

  const filteredResultsCrawl = sortedResults.filter((result) => result.discipline.includes("Crawl")).slice(0, 5);

  const filteredResultsBrystsvømning = sortedResults.filter((result) => result.discipline.includes("Brystsvømning")).slice(0, 5);

  const filteredResultsButterfly = sortedResults.filter((result) => result.discipline.includes("Butterfly")).slice(0, 5);

  const filteredResultsRygcrawl = sortedResults.filter((result) => result.discipline.includes("Rygcrawl")).slice(0, 5);

  showTop5(filteredResultsCrawl, "crawl");
  showTop5(filteredResultsBrystsvømning, "brystsvømning");
  showTop5(filteredResultsButterfly, "butterfly");
  showTop5(filteredResultsRygcrawl, "rygcrawl");
}

function sortTop5(a, b) {
  return a.time.localeCompare(b.time);
}

// Funktion til DOM-manipulation
async function showTop5(results, discipline) {
  for (const result of results) {
    try {
      const user = await getMember(result.swimmer);

      const grid = document.querySelector("#front-grid-" + discipline);

      grid.insertAdjacentHTML(
        "beforeend",
        /*html*/ `

<article class="top5-card">
  <div id="top5-color">
    <h2>${user.firstName} ${user.lastName}</h2>
  </div>
  <p>${user.ageGroup}</p>
  <p>${result.meetName}</p>
  <p>${result.discipline}</p>
  <p>${result.time}</p>

</article>
`
      );
    } catch (error) {
      console.log(`fejl i result ${result.id}`);
    }
  }
}

/* =============== EXPORT =============== */

export { updateResultsGrid };
