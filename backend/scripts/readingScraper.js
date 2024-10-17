function getDateInScraperFormat() {
  // Format (MMDDYYYY) For example (04142003 is my birthday)
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}${day}${year}`;
}

async function getOrdinaryReadings(dateInFormat) {
  const response = await fetch(
    `https://bible.usccb.org/bible/readings/${dateInFormat}.cfm`
  );
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  const html = await response.text();
  const firstReading = html
    .split(`<h3 class="name">Reading 1 </h3>`)[1]
    .split('<a href="')[1]
    .split('">')[1]
    .split("</a>")[0];

  const responsorialPsalm = html
    .split(`<h3 class="name">Responsorial Psalm </h3>`)[1]
    .split('<a href="')[1]
    .split('">')[1]
    .split("</a>")[0];

  const secondReading = html
    .split(`<h3 class="name">Gospel </h3>`)[1]
    .split('<a href="')[1]
    .split('">')[1]
    .split("</a>")[0];
  return {
    reading: firstReading,
    psalm: responsorialPsalm,
    gospel: secondReading,
  };
}

getOrdinaryReadings(getDateInScraperFormat()).then((res) => console.log(res));

module.exports = {
  getDateInScraperFormat,
  getOrdinaryReadings,
};
