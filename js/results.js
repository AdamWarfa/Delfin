"use strict";

// export { signUpClicked, createMember };

const endpoint = "https://delfinen-d6932-default-rtdb.europe-west1.firebasedatabase.app/";

async function getResults() {
  const response = await fetch(`${endpoint}/fesults.json`); // fetch request, (GET)    method: "GET",
  const data = await response.json(); // parse JSON to JavaScript
  const results = prepareData(data); // convert object of object to array of objects
  return results; // return results
}
