function getDateInScraperFormat() {
  // Format (MMDDYYYY) For example (04142003 is my birthday)
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}${month}${day}`;
}

async function getTodaysReadings(dateInFormat) {
  const response = await fetch(
    `https://www.universalis.com/${dateInFormat}/jsonpmass.js`
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
    firstReading: scrapedJson.Mass_R1.source,
    secondReading: scrapedJson.Mass_R2?.source,
    psalm: scrapedJson.Mass_Ps.source,
    alleluia: scrapedJson.Mass_GA.source,
    gospel: scrapedJson.Mass_G.source,
  };
}

module.exports = {
  getTodaysReadings,
};
