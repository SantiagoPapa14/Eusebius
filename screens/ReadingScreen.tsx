import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Easing,
  StyleSheet,
  Linking,
  PanResponder,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import SkeletonLoader from "../components/SkeletonLoader";
import Toast from "react-native-toast-message";
import { getReadingByItself } from "../scripts/webScraper";
import { fetchVerses } from "../scripts/bibleLibrary";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const ReadingScreen = () => {
  const [readings, setReadings] = useState([]);
  const [selectedReading, setSelectedReading] = useState("gospel");
  const [selectedVerse, setSelectedVerse] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state

  const slideAnim = useRef(new Animated.Value(0)).current; // For slide effect
  const fadeAnim = useRef(new Animated.Value(1)).current; // For fade effect

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["85%"], []);
  const [definitionIsOpen, setDefinitionIsOpen] = useState(false);
  const [definitionData, setDefinitionData] = useState(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setDefinitionIsOpen(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const readingsData = await getReadingByItself();
        for (const [key, value] of Object.entries(readingsData)) {
          if (value) {
            readingsData[key].latinContent = await fetchVerses(value, "Latin");

            readingsData[key].englishContent = await fetchVerses(
              value,
              "English"
            );
          }
        }
        setReadings(readingsData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const slideToNextVerse = (direction: string) => {
    if (isAnimating) return; // Prevent sliding if animation is in progress
    setIsAnimating(true); // Lock sliding
    const toValue = direction === "prev" ? 400 : -400; // Slide right or left
    Animated.timing(slideAnim, {
      toValue, // Use positive for next and negative for prev
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // Update verse
      setSelectedVerse((prev) => (direction === "next" ? prev + 1 : prev - 1));
      slideAnim.setValue(-toValue); // Reset for smooth transition
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false); // Unlock sliding after animation completes
      }); // Slide back to center
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 30; // Set threshold for detecting a swipe
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          if (!isFirstVerse) {
            slideToNextVerse("prev");
          }
        } else {
          if (!isLastVerse) {
            slideToNextVerse("next");
          }
        }
      },
    })
  ).current;

  const handleChangeReading = (readingType: string) => {
    if (readings[readingType] === null) {
      showToast(`Sorry, no ${readingType} available.`, "error");
      return;
    }
    if (isAnimating) return;
    setIsAnimating(true);
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedVerse(0); // Prevent changing readings during animation
      setSelectedReading(readingType);
      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const showToast = (message: string, type: string) => {
    Toast.show({
      type: type,
      text1: message,
    });
  };

  if (loading) {
    return (
      <View className="flex-1">
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
            <View className="flex-1 items-center justify-center w-screen mt-10 pr-5 pl-5">
              <Text className="text-lg text-center">
                <SkeletonLoader />
              </Text>
            </View>

            {/* Verse Navigation */}
            <View className="flex-row justify-center items-center rounded-full bg-white h-20 w-3/4">
              <TouchableOpacity className="mx-2" disabled>
                <Icon name="arrow-back" size={30} color="gray" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="flex text-lg items-center text-center">
                  Loading...
                </Text>
              </View>
              <TouchableOpacity className="mx-2" disabled>
                <Icon name="arrow-forward" size={30} color="gray" />
              </TouchableOpacity>
            </View>

            {/* Placeholder for English Content */}
            <View className="flex-1 items-center justify-center w-screen mb-10 pr-5 pl-5">
              <Text className="text-lg text-center">
                <SkeletonLoader />
              </Text>
            </View>

            {/* Reading Selector */}
            <View className="flex-row justify-center items-center bg-white h-20 w-screen">
              <TouchableOpacity
                className="flex-1 items-center justify-center h-20"
                disabled
              >
                <Text>Psalm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 items-center justify-center h-20"
                disabled
              >
                <Text className="font-bold text-base">Gospel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 items-center justify-center h-20"
                disabled
              >
                <Text>Reading</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gbGray">
        <Text className="text-lg text-center">{error}</Text>
      </View>
    );
  }

  const isFirstVerse = selectedVerse === 0;
  const isLastVerse =
    readings[selectedReading].verses.start + selectedVerse >=
    readings[selectedReading].verses.end;

  const SecondReadingComponent = () => {
    if (readings.secondReading !== null) {
      return (
        <TouchableOpacity
          className="flex-1 items-center justify-center h-20"
          onPress={() => handleChangeReading("secondReading")}
        >
          <Text
            className={
              selectedReading === "secondReading" ? "font-bold text-base" : ""
            }
          >
            Reading 2
          </Text>
        </TouchableOpacity>
      );
    } else {
      return;
    }
  };

  function replaceSpecialChars(str: string) {
    const specialChars = {
      æ: "ae",
      Æ: "AE",
      ø: "o",
      Ø: "O",
      å: "a",
      Å: "A",
      œ: "oe",
      Œ: "OE",
      þ: "th",
      Þ: "TH",
      ð: "d",
      Ð: "D",
      ü: "u",
      Ü: "U",
      ö: "o",
      Ö: "O",
      ß: "ss",
      // Add other special characters here
    };

    return str.replace(
      /æ|Æ|ø|Ø|å|Å|œ|Œ|þ|Þ|ð|Ð|ü|Ü|ö|Ö|ß/g,
      (match) => specialChars[match]
    );
  }

  const handleWordPress = async (word: string) => {
    Toast.show({
      type: "info",
      text1: "Loading definition...",
    });
    // https://www.latin-is-simple.com/api/vocabulary/search/?query=WORD_GOES_HERE
    const cleanWord = replaceSpecialChars(
      word
        .replaceAll(":", "")
        .replaceAll(",", "")
        .replaceAll(".", "")
        .replaceAll(" ", "")
    );

    const url = `https://www.latin-is-simple.com/api/vocabulary/search/?query=${cleanWord}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) {
      Toast.show({
        type: "error",
        text1: "No translation found.",
      });
    } else {
      setDefinitionData(data[0]);
      await new Promise((r) => setTimeout(r, 500));
      setDefinitionIsOpen(true);
      Toast.hide();
    }
  };

  const renderText = (text: string) => {
    return text.split(" ").map((word, index) => (
      <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
        <Text className="text-lg">{word} </Text>
      </TouchableOpacity>
    ));
  };

  const DefinitionCoponent = () => {
    if (definitionIsOpen) {
      {
        return (
          <GestureHandlerRootView style={styles.container}>
            <BottomSheet
              ref={bottomSheetRef}
              onChange={handleSheetChanges}
              snapPoints={snapPoints}
              enablePanDownToClose={true} // Allowing the sheet to be dragged down to close
            >
              <BottomSheetView style={styles.contentContainer}>
                <View className="flex-1 flex items-center">
                  <Text className="text-3xl font-bold">
                    {definitionData.short_name.charAt(0).toUpperCase() +
                      definitionData.short_name.slice(1)}
                  </Text>
                  <Text className="text-lg">{definitionData.full_name}</Text>
                  <Text className="text-lg italic">{`(${definitionData.type.label})`}</Text>
                  <Text className="text-xl mt-10 text-center">
                    {definitionData.translations_unstructured.en}
                  </Text>
                  <TouchableOpacity className="mt-10">
                    <Text
                      onPress={() => Linking.openURL(definitionData.url)}
                      className="text-lg text-center text-blue-500 italic"
                    >
                      Press here for a more in depth definition!
                    </Text>
                  </TouchableOpacity>
                </View>
              </BottomSheetView>
            </BottomSheet>
          </GestureHandlerRootView>
        );
      }
    }
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
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <View className="flex-1 h-screen items-center justify-center bg-gbGray">
          {/* Animated Latin Content (Sliding and Fading) */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
            className="flex-1 items-center justify-center w-screen mt-10 pr-5 pl-5"
          >
            <Text className="text-lg text-center">
              {renderText(
                readings[selectedReading].latinContent[Number(selectedVerse)]
                  .Content
              )}
            </Text>
          </Animated.View>

          {/* Verse Navigation */}
          <View className="flex-row justify-center items-center rounded-full bg-white h-20 w-3/4">
            <TouchableOpacity
              className="mx-2"
              disabled={isFirstVerse || isAnimating}
              onPress={() => {
                if (!isFirstVerse) {
                  slideToNextVerse("prev");
                }
              }}
            >
              <Icon
                name="arrow-back"
                size={30}
                color={isFirstVerse ? "white" : "black"} // Disable color
              />
            </TouchableOpacity>
            <Animated.View
              style={{
                opacity: fadeAnim,
              }}
              className="flex-1"
            >
              <Text className="flex text-lg items-center text-center">{`${
                readings[selectedReading].book
              } ${readings[selectedReading].chapter}:${
                readings[selectedReading].verses.start + selectedVerse
              }`}</Text>
            </Animated.View>

            <TouchableOpacity
              className="mx-2"
              disabled={isLastVerse || isAnimating}
              onPress={() => {
                if (!isLastVerse) {
                  slideToNextVerse("next");
                }
              }}
            >
              <Icon
                name="arrow-forward"
                size={30}
                color={isLastVerse ? "white" : "black"} // Disable color
              />
            </TouchableOpacity>
          </View>

          {/* Animated English Content (Sliding and Fading) */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
            className="flex-1 items-center justify-center w-screen mb-10 pr-5 pl-5"
          >
            <Text className="text-lg text-center">
              {
                readings[selectedReading].englishContent[Number(selectedVerse)]
                  .Content
              }
            </Text>
          </Animated.View>
        </View>
        {/* Reading Selector */}
        <View className="flex-row justify-center items-center bg-white h-20 w-screen">
          <TouchableOpacity
            className="flex-1 items-center justify-center h-20"
            onPress={() => handleChangeReading("psalm")}
          >
            <Text
              className={
                selectedReading === "psalm" ? "font-bold text-base" : ""
              }
            >
              Psalm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center h-20"
            onPress={() => handleChangeReading("gospel")}
          >
            <Text
              className={
                selectedReading === "gospel" ? "font-bold text-base" : ""
              }
            >
              Gospel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center h-20"
            onPress={() => handleChangeReading("firstReading")}
          >
            <Text
              className={
                selectedReading === "firstReading" ? "font-bold text-base" : ""
              }
            >
              {readings.secondReading == null ? "Reading" : "Reading 1"}
            </Text>
          </TouchableOpacity>
          <SecondReadingComponent />
        </View>
      </View>

      <DefinitionCoponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
  },
});

export default ReadingScreen;
