export type verseType = {
  chapter: number;
  start: number;
  end: number;
};

type contentType = {
  [key: number]: string;
};

export type readingType = {
  book: string;
  verses: Array<verseType>;
  latinContent?: contentType;
  spanishContent?: contentType;
  englishContent?: contentType;
};

export type massReadingsType = {
  psalm: readingType;
  gospel: readingType;
  firstReading: readingType;
  secondReading?: readingType;
};

export type localBookData = {
  Book: string;
  Key: string;
  Chapters: contentType;
};
