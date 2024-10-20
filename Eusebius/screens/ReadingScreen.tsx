import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import SkeletonLoader from "../components/SkeletonLoader";
import Toast from "react-native-toast-message";

const ReadingScreen = () => {
  const [readings, setReadings] = useState([]);
  const [selectedReading, setSelectedReading] = useState("gospel");
  const [selectedVerse, setSelectedVerse] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state

  const slideAnim = useRef(new Animated.Value(0)).current; // For slide effect
  const fadeAnim = useRef(new Animated.Value(1)).current; // For fade effect

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://10.0.0.55:3000/readings");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const readingsData = await response.json();
        for (const [key, value] of Object.entries(readingsData)) {
          if (value) {
            const latinReadingContent = await fetch(
              `http://10.0.0.55:3000/bible?book=${value.book}&chapter=${value.chapter}&verses=${value.verses.start}-${value.verses.end}`
            );
            readingsData[key].latinContent = await latinReadingContent.json();
          }
          if (value) {
            const englishReadingContent = await fetch(
              `http://10.0.0.55:3000/bible?book=${value.book}&chapter=${value.chapter}&verses=${value.verses.start}-${value.verses.end}&translated=true`
            );
            readingsData[key].englishContent =
              await englishReadingContent.json();
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
          {/* Animated Latin Content (Sliding and Fading) */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
            className="flex-1 items-center justify-center w-screen mt-10 pr-5 pl-5"
          >
            <Text className="text-lg text-center">
              {
                readings[selectedReading].latinContent[Number(selectedVerse)]
                  .text
              }
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
                  .text
              }
            </Text>
          </Animated.View>

          {/* Reading Selector (Fade effect) */}
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
                  selectedReading === "firstReading"
                    ? "font-bold text-base"
                    : ""
                }
              >
                Reading
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReadingScreen;
