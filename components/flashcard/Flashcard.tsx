import React, { useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";

const Flashcard = ({ front, back }: { front: string; back: string }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipCard = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: Platform.OS !== "web",
    }).start(() => {
      setIsFlipped(!isFlipped);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    });
  };

  return (
    <TouchableOpacity
      onPress={handleFlipCard}
      activeOpacity={1}
      style={styles.card}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        {isFlipped ? (
          <Text style={styles.backText}>{back}</Text>
        ) : (
          <Text style={styles.frontText}>
            {front.charAt(0).toUpperCase() + front.slice(1)}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  frontText: {
    fontSize: 24,
    textAlign: "center",
  },
  backText: {
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default Flashcard;
