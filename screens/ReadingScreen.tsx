import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import rawLatinBible from "../constants/latin_bible.json";
import rawSpanishBible from "../constants/spanish_bible.json";
import { localBible, DailyMassScripture } from "../constants/EusebiusTypes";
import { useAuth } from "../context/AuthContext";
import { useScriptureReader } from "../hooks/scriptureReader";

import ReadingSelector from "../components/reading/ReadingSelector";
import VerseNavigation from "../components/reading/VerseSelector";
import CurrentVerse from "../components/reading/CurrentVerse";
import LatinText from "../components/reading/LatinText";
import EnglishText from "../components/reading/EnglishText";
import SkeletonReader from "../components/reading/SkeletonReader";
import Definition from "../components/reading/Definition";

const SWIPE_THRESHOLD = 30;

const ANIMATION_DURATION = 200;
const SLIDE_DISTANCE = 600;

const ANIMATION_CONFIG = {
  duration: ANIMATION_DURATION,
  useNativeDriver: true,
};

const ReadingScreen = () => {
  const { secureFetch } = useAuth();

  const latinBible = rawLatinBible as localBible;
  const spanishBible = rawSpanishBible as localBible;

  const {
    scripture,
    selectedReading,
    verseContent,
    loading,
    error,
    canNavigate,
    navigateVerse,
    changeReading,
  } = useScriptureReader({ secureFetch, latinBible, spanishBible } as any);

  const [isAnimating, setIsAnimating] = useState(false);
  const [definitionIsOpen, setDefinitionIsOpen] = useState(false);
  const [definitionData, setDefinitionData] = useState(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bottomSheetRef = useRef<BottomSheet>(null);

  const animateSlide = (direction: "prev" | "next") => {
    return new Promise<void>((resolve) => {
      const toValue = direction === "prev" ? SLIDE_DISTANCE : -SLIDE_DISTANCE;
      setIsAnimating(true);

      Animated.timing(slideAnim, {
        toValue,
        ...ANIMATION_CONFIG,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        resolve();
        slideAnim.setValue(-toValue);

        Animated.timing(slideAnim, {
          toValue: 0,
          ...ANIMATION_CONFIG,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setIsAnimating(false);
          resolve();
        });
      });
    });
  };

  const handleVerseNavigation = async (direction: "prev" | "next") => {
    await animateSlide(direction);
    navigateVerse(direction);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > SWIPE_THRESHOLD,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 0 && canNavigate.prev) {
        handleVerseNavigation("prev");
      } else if (gestureState.dx < 0 && canNavigate.next) {
        handleVerseNavigation("next");
      }
    },
  });

  const handleChangeReading = (readingType: keyof DailyMassScripture) => {
    if (isAnimating) return;

    setIsAnimating(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      ...ANIMATION_CONFIG,
    }).start(() => {
      changeReading(readingType);
      Animated.timing(fadeAnim, {
        toValue: 1,
        ...ANIMATION_CONFIG,
      }).start(() => setIsAnimating(false));
    });
  };

  if (!secureFetch) return null;
  if (loading) return <SkeletonReader />;
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (!verseContent || !scripture) return null;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        style={[styles.background, { opacity: 0.1 }]}
        resizeMode="cover"
      />
      <View style={styles.contentWrapper}>
        <View style={styles.readerContainer}>
          <LatinText
            content={verseContent.latin}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            setDefinitionData={setDefinitionData}
            setDefinitionIsOpen={setDefinitionIsOpen}
          />

          <VerseNavigation
            isFirstVerse={!canNavigate.prev || isAnimating}
            isLastVerse={!canNavigate.next || isAnimating}
            onPrevious={() => handleVerseNavigation("prev")}
            onNext={() => handleVerseNavigation("next")}
          >
            <CurrentVerse
              bookName={verseContent.bookName}
              chapter={verseContent.chapter}
              selectedVerse={verseContent.verse}
              fadeAnim={fadeAnim}
            />
          </VerseNavigation>

          <EnglishText
            content={verseContent.spanish}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        </View>

        <ReadingSelector
          readings={scripture}
          selectedReading={selectedReading}
          handleChangeReading={handleChangeReading}
        />
      </View>

      <Definition
        definitionData={definitionData!}
        definitionIsOpen={definitionIsOpen}
        setDefinitionIsOpen={setDefinitionIsOpen}
        selfRef={bottomSheetRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
  contentWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  readerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ReadingScreen;
