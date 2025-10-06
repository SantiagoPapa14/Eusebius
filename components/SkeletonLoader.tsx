import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

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
      style={[
        styles.pulsingView,
        {
          transform: [{ scale }],
          width: width,
        },
      ]}
    />
  );
};

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      <PulsingView width={128} />
      <PulsingView width={160} />
      <PulsingView width={128} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pulsingView: {
    height: 16,
    backgroundColor: "#D1D5DB",
    borderRadius: 9999,
    marginBottom: 8,
  },
});

export default SkeletonLoader;
