const latinBible = require("../constants/latin/VULG.json");
const englishBible = require("../constants/english/CPDV.json");

function getReading(book, chapter, verses, translated) {
  try {
    if (book && chapter && verses) {
      const bible = translated ? englishBible : latinBible;
      const SelectedBook = bible.books.find((b) => b.name === book);
      const SelectedChapter = SelectedBook.chapters.find(
        (c) => c.chapter === Number(chapter)
      );
      let chapterCopy = { ...SelectedChapter };
      const SelectedVerses = chapterCopy.verses.filter(
        (v) =>
          v.verse <= verses.split("-")[1] && v.verse >= verses.split("-")[0]
      );
      return SelectedVerses.map((verse) => {
        return {
          name: verse.name,
          text: verse.text,
        };
      });
    } else {
      return null;
    }
  } catch (error) {
    console.log(`Fetching ${book} ${chapter} ${verses} failed:\n${error}`);
    return null;
  }
}

module.exports = {
  getReading,
};
