import { Text, Animated } from "react-native";
import React from "react";

interface EnglishTextProps {
  content: string;
  fadeAnim?: Animated.Value;
  slideAnim: Animated.Value;
}

const EnglishText: React.FC<EnglishTextProps> = ({
  content,
  fadeAnim,
  slideAnim,
}) => {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim ?? 1,
        transform: [{ translateX: slideAnim }],
      }}
      className="flex-1 items-center justify-center w-screen mt-10 pr-5 pl-5"
    >
      <Text className="text-lg text-center">{content}</Text>
    </Animated.View>
  );
};

export default EnglishText;
