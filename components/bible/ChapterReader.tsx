import React, { useState, useRef } from "react";
import {
  View,
  ImageBackground,
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

import { LocalBook, localBible } from "../../constants/EusebiusTypes";
import VerseNavigation from "../reading/VerseSelector";
import CurrentVerse from "../reading/CurrentVerse";
import LatinText from "../reading/LatinText";
import EnglishText from "../reading/EnglishText";
import Definition from "../reading/Definition";
import { useAuth } from "../../context/AuthContext";

import rawLatinBible from "../../constants/latin_bible.json";
import rawSpanishBible from "../../constants/spanish_bible.json";

const ANIMATION_DURATION = 200;
const SLIDE_DISTANCE = 600;

const ANIMATION_CONFIG = {
  duration: ANIMATION_DURATION,
  useNativeDriver: true,
};

const ChapterReader = ({
  book,
  chapter,
}: {
  book: LocalBook;
  chapter: number;
}) => {
  const { secureFetch } = useAuth();
  if (!secureFetch) return null;

  const latin_bible = rawLatinBible as localBible;
  const spanish_bible = rawSpanishBible as localBible;

  const [selectedVerse, setSelectedVerse] = useState(1);
  const [definitionIsOpen, setDefinitionIsOpen] = useState(false);
  const [definitionData, setDefinitionData] = useState(null);

  const [isAnimating, setIsAnimating] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetRef = useRef<BottomSheet>(null);

  const slideToNextVerse = (direction: "prev" | "next") => {
    if (direction === "prev" && isFirstVerse()) return;
    if (direction === "next" && isLastVerse()) return;

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
        setSelectedVerse(
          direction === "prev" ? selectedVerse - 1 : selectedVerse + 1,
        );

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

  const isFirstVerse = () => selectedVerse === 1;
  const isLastVerse = () => {
    return (
      selectedVerse ===
      Object.keys(latin_bible[book.Key]["chapters"][chapter]).length
    );
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <ImageBackground
        source={require("../../assets/MichaelWpp.jpg")}
        style={[styles.background, { opacity: 0.1 }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.readerContainer}>
          <LatinText
            content={latin_bible[book.Key]["chapters"][chapter][selectedVerse]}
            slideAnim={slideAnim}
            setDefinitionData={setDefinitionData}
            setDefinitionIsOpen={setDefinitionIsOpen}
          />
          <VerseNavigation
            isFirstVerse={isFirstVerse() || isAnimating}
            isLastVerse={isLastVerse() || isAnimating}
            onPrevious={() => slideToNextVerse("prev")}
            onNext={() => slideToNextVerse("next")}
          >
            <CurrentVerse
              bookName={book.Book}
              chapter={chapter}
              selectedVerse={selectedVerse}
            />
          </VerseNavigation>
          <EnglishText
            content={
              spanish_bible[book.Key]["chapters"][chapter][selectedVerse]
            }
            slideAnim={slideAnim}
          />
        </View>
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: "center",
  },
  readerContainer: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChapterReader;
