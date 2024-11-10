// Flashcard.tsx
import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

const Flashcard = ({ front, back }: { front: string; back: string }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipCard = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <TouchableOpacity
      onPress={() => handleFlipCard()}
      activeOpacity={1}
      className="w-80 h-3/5 p-5 bg-white rounded-lg border border-gray-400 shadow border-gray-200 flex justify-center items-center"
      style={{
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
        }}
      >
        {isFlipped ? (
          <Text className="text-2xl italic">{back}</Text>
        ) : (
          <Text className="text-3xl">
            {front.charAt(0).toUpperCase() + front.slice(1)}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Flashcard;
