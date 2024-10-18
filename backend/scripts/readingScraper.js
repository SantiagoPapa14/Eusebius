function getDateInScraperFormat() {
  // Format (MMDDYYYY) For example (04142003 is my birthday)
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}${month}${day}`;
}

function parseReference(reference) {
  if (reference) {
    const regex = /(\d*\s*[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?/;
    const match = reference.match(regex);

    if (match) {
      return {
        book: match[1].trim(),
        chapter: parseInt(match[2], 10),
        verses: {
          start: parseInt(match[3], 10),
          end: match[4] ? parseInt(match[4], 10) : null,
        },
      };
    }
  }
  return null;
}

async function getTodaysReadings() {
  const response = await fetch(
    `https://www.universalis.com/${getDateInScraperFormat()}/jsonpmass.js`
  );
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  const html = await response.text();
  var parsed = html
    .split("universalisCallback(")[1]
    .replaceAll("&#x2010;", "-")
    .trim()
    .slice(0, -2);
  const scrapedJson = JSON.parse(parsed);
  return {
    firstReading: parseReference(scrapedJson.Mass_R1.source),
    secondReading: parseReference(scrapedJson.Mass_R2?.source),
    psalm: parseReference(scrapedJson.Mass_Ps.source),
    alleluia: parseReference(scrapedJson.Mass_GA.source),
    gospel: parseReference(scrapedJson.Mass_G.source),
  };
}

module.exports = {
  getTodaysReadings,
};
