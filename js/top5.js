import { getResults, getMember } from "./rest-service.js";

async function updateResultsGrid() {
  const listOfResults = await getResults();
  showAllTop5(listOfResults);
}

function showAllTop5(listOfResults) {
  const sortedResults = listOfResults.sort(sortTop5);
  console.log(sortedResults);
  document.querySelector("#front-grid-crawl").innerHTML = "";
  document.querySelector("#front-grid-brystsvømning").innerHTML = "";
  document.querySelector("#front-grid-butterfly").innerHTML = "";
  document.querySelector("#front-grid-rygcrawl").innerHTML = "";

  const filteredResultsCrawl = sortedResults.filter(result => result.discipline.includes("Crawl")).slice(0, 5);
  console.log(filteredResultsCrawl);

  const filteredResultsBrystsvømning = sortedResults.filter(result => result.discipline.includes("Brystsvømning")).slice(0, 5);
  console.log(filteredResultsBrystsvømning);

  const filteredResultsButterfly = sortedResults.filter(result => result.discipline.includes("Butterfly")).slice(0, 5);
  console.log(filteredResultsButterfly);

  const filteredResultsRygcrawl = sortedResults.filter(result => result.discipline.includes("Rygcrawl")).slice(0, 5);
  console.log(filteredResultsRygcrawl);

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
      console.log(result);

      const user = await getMember(result.swimmer);
      console.log(user);

      console.log("#front-grid-" + discipline);
      const grid = document.querySelector("#front-grid-" + discipline);
      console.log(grid);

      grid.insertAdjacentHTML(
        "beforeend",
        /*html*/ `

<article class="top5-card">
  <h2>${user.firstName} ${user.lastName}</h2>
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
