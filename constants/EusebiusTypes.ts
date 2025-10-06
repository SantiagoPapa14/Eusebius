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

export interface LocalBook {
  Book: string;
  Chapters: string;
  Key: string;
}

// API return types

export interface DailyMassScripture {
  psalm?: Reading | null;
  gospel?: Reading | null;
  firstReading?: Reading | null;
  secondReading?: Reading | null;
}

export interface Reading {
  book?: string | null;
  extracts?: BookExtract[] | null;
}

export interface BookExtract {
  chapter?: string | null;
  verses?: VerseRange | null;
}

export interface VerseRange {
  start: string;
  end: string;
}

export interface Word {
  id: number;
  text: string;
  translation: string;
}
