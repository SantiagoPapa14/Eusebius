import { Text, Animated } from "react-native";
import React, { FC } from "react";
import { readingType } from "../../constants/EusebiusTypes";

interface CurrentVerseProps {
  bookName: string;
  chapter: number | string;
  selectedVerse: number;
  fadeAnim?: Animated.Value;
}

const CurrentVerse: React.FC<CurrentVerseProps> = ({
  bookName,
  chapter,
  selectedVerse,
  fadeAnim,
}) => {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}
      className="flex-1"
    >
      <Text className="flex text-lg items-center text-center">{`${bookName} ${chapter}:${selectedVerse}`}</Text>
    </Animated.View>
  );
};

export default CurrentVerse;
