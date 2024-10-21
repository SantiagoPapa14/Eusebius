import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

const PulsingView = ({ width }: { width: number }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [scale]);

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        height: 16, // Change to match your height (h-4 = 1rem = 16px)
        backgroundColor: "#D1D5DB", // Change to match your color (bg-gray-300)
        borderRadius: 9999, // Change to match your rounded class
        width: width,
        marginBottom: 8, // Change to match your mb-2
      }}
    />
  );
};

const SkeletonLoader = () => {
  return (
    <View className="flex-1 flex items-center justify-center">
      <PulsingView width={128} />
      <PulsingView width={160} />
      <PulsingView width={128} />
    </View>
  );
};

export default SkeletonLoader;
