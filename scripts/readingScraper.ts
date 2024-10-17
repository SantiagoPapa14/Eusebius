function getDateInScraperFormat(): string {
  // Format (MMDDYYYY) For example (04142003 is my birthday)
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}${day}${year}`;
}

async function getReadings(dateInFormat: string) {
  const response = await fetch(
    `https://bible.usccb.org/bible/readings/${dateInFormat}.cfm`
  );
  //Finish scraping
  return response;
}

const today = getDateInScraperFormat();
getReadings(today).then((res) => console.log(res));
