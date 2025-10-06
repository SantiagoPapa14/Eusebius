import { Text, Animated, StyleSheet } from "react-native";
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
      style={[
        styles.container,
        {
          opacity: fadeAnim ?? 1,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <Text style={styles.text}>{content}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 40,
    paddingRight: 20,
    paddingLeft: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default EnglishText;
