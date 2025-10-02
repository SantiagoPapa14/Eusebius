// What is returned from API

export type massReadingsType = {
  psalm: readingType;
  gospel: readingType;
  firstReading: readingType;
  secondReading?: readingType;
};

export type readingType = {
  book: keyof localBible;
  verses: Array<verseType>;
};

export type verseType = {
  chapter: number;
  start: number;
  end: number;
};

// Locally Stored Bibles

export type localBible = {
  [book: string]: {
    title: string;
    chapters: {
      [chapter: string]: {
        [verse: string]: string;
      };
    };
  };
};
