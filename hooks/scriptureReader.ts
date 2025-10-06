import { useState, useEffect, useMemo, useCallback } from "react";
import { DailyMassScripture, localBible } from "../constants/EusebiusTypes";

interface UseScriptureReaderProps {
  secureFetch: (route: string, params?: any) => Promise<any>;
  latinBible: localBible;
  spanishBible: localBible;
}

interface VerseContent {
  latin: string;
  spanish: string;
  bookName: string;
  chapter: number;
  verse: number;
}

export const useScriptureReader = ({
  secureFetch,
  latinBible,
  spanishBible,
}: UseScriptureReaderProps) => {
  const [scripture, setScripture] = useState<DailyMassScripture | null>(null);
  const [selectedReading, setSelectedReading] =
    useState<keyof DailyMassScripture>("gospel");
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [selectedReadingPart, setSelectedReadingPart] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const readingsJson = await secureFetch("/reading/all");
        setScripture(readingsJson);
        const firstVerse = parseInt(
          readingsJson.gospel?.extracts?.[0]?.verses?.start ?? "1",
        );
        setSelectedVerse(firstVerse);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load scripture",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [secureFetch]);

  // Helper to safely get current reading data
  const getCurrentReading = useCallback(() => {
    if (!scripture) return null;
    return scripture[selectedReading];
  }, [scripture, selectedReading]);

  // Helper to safely get current extract
  const getCurrentExtract = useCallback(() => {
    const reading = getCurrentReading();
    return reading?.extracts?.[selectedReadingPart] ?? null;
  }, [getCurrentReading, selectedReadingPart]);

  // Get verse content with proper null handling
  const verseContent = useMemo((): VerseContent | null => {
    const reading = getCurrentReading();
    const extract = getCurrentExtract();

    if (!reading || !extract) return null;

    const book = reading.book ?? "GEN";
    const chapter = parseInt(extract.chapter || "1");
    const verseKey = selectedVerse.toString();
    const chapterKey = chapter.toString();

    const latinChapter = latinBible[book]?.chapters?.[chapterKey];
    const spanishChapter = spanishBible[book]?.chapters?.[chapterKey];

    return {
      latin: latinChapter?.[verseKey] ?? "",
      spanish: spanishChapter?.[verseKey] ?? "",
      bookName: spanishBible[book]?.title ?? "",
      chapter,
      verse: selectedVerse,
    };
  }, [
    getCurrentReading,
    getCurrentExtract,
    selectedVerse,
    latinBible,
    spanishBible,
  ]);

  // Navigation helpers
  const canNavigate = useMemo(() => {
    const extract = getCurrentExtract();
    if (!extract) return { prev: false, next: false };

    const startVerse = parseInt(extract.verses?.start ?? "1");
    const endVerse = parseInt(extract.verses?.end ?? "1");
    const isFirstPart = selectedReadingPart === 0;
    const isLastPart =
      selectedReadingPart === (getCurrentReading()?.extracts?.length ?? 1) - 1;

    return {
      prev: selectedVerse > startVerse || !isFirstPart,
      next: selectedVerse < endVerse || !isLastPart,
    };
  }, [
    getCurrentExtract,
    selectedVerse,
    selectedReadingPart,
    getCurrentReading,
  ]);

  const navigateVerse = useCallback(
    (direction: "prev" | "next") => {
      const extract = getCurrentExtract();
      const reading = getCurrentReading();
      if (!extract || !reading || !reading.extracts) return;

      const startVerse = parseInt(extract.verses?.start ?? "1");
      const endVerse = parseInt(extract.verses?.end ?? "1");

      if (direction === "next") {
        if (selectedVerse >= endVerse) {
          // Move to next part
          const nextPart = selectedReadingPart + 1;
          if (nextPart < reading.extracts.length) {
            setSelectedReadingPart(nextPart);
            const newStart = parseInt(
              reading.extracts[nextPart].verses?.start ?? "1",
            );
            setSelectedVerse(newStart);
          }
        } else {
          setSelectedVerse((prev) => prev + 1);
        }
      } else {
        if (selectedVerse <= startVerse) {
          // Move to previous part
          const prevPart = selectedReadingPart - 1;
          if (prevPart >= 0) {
            setSelectedReadingPart(prevPart);
            const newEnd = parseInt(
              reading.extracts[prevPart].verses?.end ?? "1",
            );
            setSelectedVerse(newEnd);
          }
        } else {
          setSelectedVerse((prev) => prev - 1);
        }
      }
    },
    [getCurrentExtract, getCurrentReading, selectedVerse, selectedReadingPart],
  );

  const changeReading = useCallback(
    (readingType: keyof DailyMassScripture) => {
      if (!scripture) return;

      setSelectedReadingPart(0);
      const newReading = scripture[readingType];
      const firstVerse = parseInt(
        newReading?.extracts?.[0]?.verses?.start ?? "1",
      );
      setSelectedVerse(firstVerse);
      setSelectedReading(readingType);
    },
    [scripture],
  );

  return {
    scripture,
    selectedReading,
    verseContent,
    loading,
    error,
    canNavigate,
    navigateVerse,
    changeReading,
  };
};
