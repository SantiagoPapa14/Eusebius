export type dbVerseType = {
  Book: string;
  Chapter: number;
  Verse: number;
  Content: string;
};

export type readingType = {
  book: string;
  chapter: number;
  verses: {
    start: number;
    end: number;
  };
  latinContent?: Array<dbVerseType>;
  englishContent?: Array<dbVerseType>;
};

export type massReadingsType = {
  psalm: readingType;
  gospel: readingType;
  firstReading: readingType;
  secondReading?: readingType;
};
