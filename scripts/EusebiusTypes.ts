export interface readingType {
  book: string;
  chapter: number;
  verses: {
    start: number;
    end: number;
  };
}

export interface massReadingsType {
  gospel: readingType;
  psalm: readingType;
  firstReading: readingType;
  secondReading?: readingType;
}
