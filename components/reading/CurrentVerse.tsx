import { Text, Animated } from "react-native";
import React, { FC } from "react";
import { readingType } from "../../constants/EusebiusTypes";

interface CurrentVerseProps {
  reading: readingType;
  selectedVerse: number;
  fadeAnim: Animated.Value;
}

const CurrentVerse: React.FC<CurrentVerseProps> = ({
  reading,
  selectedVerse,
  fadeAnim,
}) => {
  if (!reading || !reading.latinContent) return null;
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}
      className="flex-1"
    >
      <Text className="flex text-lg items-center text-center">{`${reading.book} ${reading.latinContent[selectedVerse].Chapter}:${reading.latinContent[selectedVerse].Verse}`}</Text>
    </Animated.View>
  );
};

export default CurrentVerse;
