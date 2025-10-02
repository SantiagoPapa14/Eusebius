import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  ImageBackground,
  Animated,
  Easing,
  PanResponder,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import rawLatinBible from "../constants/latin_bible.json";
import rawSpanishBible from "../constants/spanish_bible.json";

import { massReadingsType, localBible } from "../constants/EusebiusTypes";
import ReadingSelector from "../components/reading/ReadingSelector";
import VerseNavigation from "../components/reading/VerseSelector";
import CurrentVerse from "../components/reading/CurrentVerse";
import LatinText from "../components/reading/LatinText";
import EnglishText from "../components/reading/EnglishText";
import SkeletonReader from "../components/reading/SkeletonReader";
import Definition from "../components/reading/Definition";
import { useAuth } from "../context/AuthContext";

const ReadingScreen = () => {
  const latinBible: localBible = rawLatinBible as localBible;
  const spanishBible: localBible = rawSpanishBible as localBible;

  const { secureFetch } = useAuth();
  if (!secureFetch) return null;
  const [readings, setReadings] = useState<massReadingsType>();
  const [selectedReading, setSelectedReading] =
    useState<keyof massReadingsType>("gospel");
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [selectedReadingPart, setSelectedReadingPart] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [definitionIsOpen, setDefinitionIsOpen] = useState(false);
  const [definitionData, setDefinitionData] = useState(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const readingsJson = await secureFetch("/readings/populated");
        setReadings(readingsJson as massReadingsType);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const latinContent = useMemo(() => {
    if (!readings) return null;
    const book = readings![selectedReading]?.book;
    const chapterIndex =
      readings![selectedReading]?.verses[selectedReadingPart].chapter;
    const chapter =
      latinBible[book!]?.chapters?.[chapterIndex?.toString() || ""];
    const verse = chapter![selectedVerse.toString() || ""];
    return verse;
  }, [readings, selectedReading, selectedReadingPart, selectedVerse]);

  const spanishContent = useMemo(() => {
    if (!readings) return null;
    const book = readings![selectedReading]?.book;
    const chapterIndex =
      readings![selectedReading]?.verses[selectedReadingPart].chapter;
    const chapter =
      spanishBible[book!]?.chapters?.[chapterIndex?.toString() || ""];
    const verse = chapter![selectedVerse.toString() || ""];
    return verse;
  }, [readings, selectedReading, selectedReadingPart, selectedVerse]);

  if (loading) return <SkeletonReader />;

  if (error)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-center">{error}</Text>
      </View>
    );

  const slideToNextVerse = (direction: "prev" | "next") => {
    if (direction === "next") {
      if (
        readings![selectedReading]?.verses[selectedReadingPart].end ===
        selectedVerse
      ) {
        if (
          selectedReadingPart !==
          readings![selectedReading]?.verses.length! - 1
        ) {
          setSelectedReadingPart(selectedReadingPart + 1);
          const newStart =
            readings![selectedReading]?.verses[selectedReadingPart + 1].start ||
            0;
          setSelectedVerse(newStart);
        }
        return;
      }
    }

    if (direction === "prev") {
      if (
        readings![selectedReading]?.verses[selectedReadingPart].start ===
        selectedVerse
      ) {
        if (selectedReadingPart !== 0) {
          setSelectedReadingPart(selectedReadingPart - 1);
          const newStart =
            readings![selectedReading]?.verses[selectedReadingPart - 1].end ||
            0;
          setSelectedVerse(newStart);
        }
        return;
      }
    }

    setSelectedVerse((prev) => (direction === "next" ? prev + 1 : prev - 1));

    const toValue = direction === "prev" ? 400 : -400;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(-toValue);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 30,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 0) {
        slideToNextVerse("prev");
      } else if (gestureState.dx < 0) {
        slideToNextVerse("next");
      }
    },
  });

  const handleChangeReading = (readingType: keyof massReadingsType) => {
    if (isAnimating) return;
    setIsAnimating(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedVerse(1);
      setSelectedReading(readingType);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsAnimating(false));
    });
  };

  return (
    <View className="flex-1" {...panResponder.panHandlers}>
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.1 }}
      />
      <View
        className="flex-1 flex justify-center"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View className="flex-1 h-screen items-center justify-center bg-gbGray">
          <LatinText
            content={latinContent || ""}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            setDefinitionData={setDefinitionData}
            setDefinitionIsOpen={setDefinitionIsOpen}
          />
          <VerseNavigation
            isFirstVerse={false}
            isLastVerse={false}
            onPrevious={() => slideToNextVerse("prev")}
            onNext={() => slideToNextVerse("next")}
          >
            <CurrentVerse
              bookName={
                spanishBible[readings![selectedReading]?.book!]?.title! || ""
              }
              chapter={
                readings![selectedReading]?.verses[selectedReadingPart].chapter!
              }
              selectedVerse={selectedVerse}
              fadeAnim={fadeAnim}
            />
          </VerseNavigation>
          <EnglishText
            content={spanishContent}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        </View>
        <ReadingSelector
          readings={readings!}
          selectedReading={selectedReading}
          handleChangeReading={handleChangeReading}
        />
      </View>
      <Definition
        definitionData={definitionData}
        definitionIsOpen={definitionIsOpen}
        setDefinitionIsOpen={setDefinitionIsOpen}
        selfRef={bottomSheetRef}
      />
    </View>
  );
};

export default ReadingScreen;
