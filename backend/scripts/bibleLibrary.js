const latinBible = require("../constants/latin/VULG.json");
const englishBible = require("../constants/english/CPDV.json");

function getReading(reading, translated) {
  if (reading) {
    const bible = translated ? englishBible : latinBible;
    const book = bible.books.find((b) => b.name === reading.book);
    const chapter = book.chapters.find((c) => c.chapter === reading.chapter);
    const verses = chapter.verses.filter(
      (v) => v.verse <= reading.verses.end && v.verse >= reading.verses.start
    );

    for (let i = 0; i < verses.length; i++) {
      delete verses[i].verse;
      delete verses[i].chapter;
    }
    return verses;
  } else {
    console.log("RETURNING NULL");
    return null;
  }
}

async function populateReadings(readings, translated) {
  try {
    readings.gospel.verses.content = getReading(readings.gospel, translated);
    readings.firstReading.verses.content = getReading(
      readings.firstReading,
      translated
    );
    if (readings.secondReading) {
      readings.secondReading.verses.content = getReading(
        readings.secondReading,
        translated
      );
    }
    if (readings.alleluia) {
      readings.alleluia.verses.content = getReading(
        readings.alleluia,
        translated
      );
    }
    if (readings.psalm) {
      readings.psalm.verses.content = getReading(readings.psalm, translated);
    }
  } catch (error) {
    console.error("Error populating readings:", error);
  }
}

module.exports = {
  getReading,
  populateReadings,
};
