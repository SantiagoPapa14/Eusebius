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

import { readingType } from "../../constants/EusebiusTypes";
import VerseNavigation from "../reading/VerseSelector";
import CurrentVerse from "../reading/CurrentVerse";
import LatinText from "../reading/LatinText";
import EnglishText from "../reading/EnglishText";
import SkeletonReader from "../reading/SkeletonReader";
import Definition from "../reading/Definition";
import { useAuth } from "../../context/AuthContext";

const ChapterReader = ({
  book,
  chapter,
}: {
  book: string;
  chapter: number;
}) => {
  const { secureFetch } = useAuth();
  if (!secureFetch) return null;

  const [chapterData, setChapterData] = useState<readingType>();
  const [selectedVerse, setSelectedVerse] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [definitionIsOpen, setDefinitionIsOpen] = useState(false);
  const [definitionData, setDefinitionData] = useState(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chapterJson: readingType = await secureFetch(
          `/bible/${book}/${chapter}`
        );
        setChapterData(chapterJson);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <SkeletonReader hideReadingSelector={true} />;

  if (error)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-center">{error}</Text>
      </View>
    );

  if (
    !chapterData ||
    !chapterData.verses ||
    !chapterData.latinContent ||
    !chapterData.englishContent
  )
    return null;

  const slideToNextVerse = (direction: "prev" | "next") => {
    if (direction === "prev" && isFirstVerse()) return;
    if (direction === "next" && isLastVerse()) return;
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

  const isFirstVerse = () => selectedVerse === 0;
  const isLastVerse = () => {
    if (!chapterData || !chapterData.latinContent) return false;
    return selectedVerse === chapterData?.latinContent.length - 1;
  };

  return (
    <View className="flex-1" {...panResponder.panHandlers}>
      <ImageBackground
        source={require("../../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.1 }}
      />
      <View
        className="flex-1 flex justify-center"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View className="flex-1 h-screen items-center justify-center">
          <LatinText
            content={chapterData?.latinContent[selectedVerse].Content}
            slideAnim={slideAnim}
            setDefinitionData={setDefinitionData}
            setDefinitionIsOpen={setDefinitionIsOpen}
          />
          <VerseNavigation
            isFirstVerse={isFirstVerse()}
            isLastVerse={isLastVerse()}
            onPrevious={() => slideToNextVerse("prev")}
            onNext={() => slideToNextVerse("next")}
          >
            <CurrentVerse
              reading={chapterData as readingType}
              selectedVerse={selectedVerse}
            />
          </VerseNavigation>
          <EnglishText
            content={chapterData?.englishContent[selectedVerse].Content}
            slideAnim={slideAnim}
          />
        </View>
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

export default ChapterReader;
