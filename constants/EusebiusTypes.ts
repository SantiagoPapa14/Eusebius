export type dbVerseType = {
  Book: string;
  Chapter: number;
  Verse: number;
  Content: string;
};

export type verseType = {
  chapter: number;
  start: number;
  end: number;
};

export type readingType = {
  book: string;
  verses: Array<verseType>;
  sourceContent?: Array<dbVerseType>;
  targetContent?: Array<dbVerseType>;
};

export type massReadingsType = {
  psalm: readingType;
  gospel: readingType;
  firstReading: readingType;
  secondReading?: readingType;
};

export type localBookData = {
  Book: string;
  Chapters: number;
};
