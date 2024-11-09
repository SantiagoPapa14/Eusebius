import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  Animated,
  Easing,
  PanResponder,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

import { getReadingByItself } from "../scripts/readingScraper";
import { populateReadings } from "../scripts/sqliteLibrary";
import { massReadingsType, readingType } from "../constants/EusebiusTypes";
import ReadingSelector from "../components/reading/ReadingSelector";
import VerseNavigation from "../components/reading/VerseSelector";
import CurrentVerse from "../components/reading/CurrentVerse";
import LatinText from "../components/reading/LatinText";
import EnglishText from "../components/reading/EnglishText";
import SkeletonReader from "../components/reading/SkeletonReader";
import Definition from "../components/reading/Definition";

const ReadingScreen = () => {
  const [readings, setReadings] = useState<massReadingsType>();
  const [selectedReading, setSelectedReading] =
    useState<keyof massReadingsType>("gospel");
  const [selectedVerse, setSelectedVerse] = useState(0);
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
        const readingsData = await getReadingByItself();
        const populatedReadings = await populateReadings(readingsData);
        setReadings(Object.fromEntries(populatedReadings));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const slideToNextVerse = (direction: "prev" | "next") => {
    if (isAnimating) return;

    if (direction === "prev" && selectedVerse === 0) return;

    if (
      direction === "next" &&
      readings[selectedReading]?.verses.start + selectedVerse >=
        readings[selectedReading]?.verses.end
    )
      return;

    setIsAnimating(true);

    const toValue = direction === "prev" ? 400 : -400;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setSelectedVerse((prev) => (direction === "next" ? prev + 1 : prev - 1));
      slideAnim.setValue(-toValue);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setIsAnimating(false));
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
      setSelectedVerse(0);
      setSelectedReading(readingType);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsAnimating(false));
    });
  };

  function isFirstVerse(verse: number) {
    return verse === 0;
  }

  function isLastVerse(verse: number, start: number, end: number) {
    return start + verse >= end;
  }

  if (loading) return <SkeletonReader />;
  if (error)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-center">{error}</Text>
      </View>
    );

  if (
    !readings ||
    !readings[selectedReading] ||
    !readings[selectedReading].verses ||
    !readings[selectedReading].latinContent ||
    !readings[selectedReading].englishContent
  )
    return null;

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
            content={
              readings[selectedReading].latinContent[selectedVerse]
                .Content as string
            }
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            setDefinitionData={setDefinitionData}
            setDefinitionIsOpen={setDefinitionIsOpen}
          />
          <VerseNavigation
            isFirstVerse={isFirstVerse(selectedVerse)}
            isLastVerse={isLastVerse(
              selectedVerse,
              readings[selectedReading].verses.start,
              readings[selectedReading].verses.end
            )}
            onPrevious={() => slideToNextVerse("prev")}
            onNext={() => slideToNextVerse("next")}
          >
            <CurrentVerse
              reading={readings[selectedReading] as readingType}
              selectedVerse={selectedVerse}
              fadeAnim={fadeAnim}
            />
          </VerseNavigation>
          <EnglishText
            content={
              readings[selectedReading].englishContent[selectedVerse]
                .Content as string
            }
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        </View>
        <ReadingSelector
          readings={readings}
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
