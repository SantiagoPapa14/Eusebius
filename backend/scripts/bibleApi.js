require("dotenv").config();

async function getBibleVerses() {
  const reading = "LK 11:47-54";

  const book = reading.split(" ")[0];
  const chapter = reading.split(" ")[1].split(":")[0];
  const verse = reading.split(" ")[1].split(":")[1].split("-")[0];

  const response = await fetch(`http://universalis.com/mass.html`, {
    method: "GET",
    headers: {
      "api-key": "529e52aeba90d51e661c185b5d1127a3",
    },
  });
  const text = await response.text();
  console.log(text);
}
getBibleVerses();
