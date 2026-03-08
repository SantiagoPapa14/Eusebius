import { Text, Animated, StyleSheet } from "react-native";
import React from "react";

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
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Text
        style={styles.text}
      >{`${bookName} ${chapter}:${selectedVerse}`}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default CurrentVerse;
