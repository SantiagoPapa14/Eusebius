import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface VerseNavigationProps {
  isFirstVerse: boolean;
  isLastVerse: boolean;
  onNext: () => void;
  onPrevious: () => void;
  children?: React.ReactNode;
}

const VerseNavigation: React.FC<VerseNavigationProps> = ({
  isFirstVerse,
  isLastVerse,
  onNext,
  onPrevious,
  children,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPrevious}
        disabled={isFirstVerse}
      >
        <Icon
          name="arrow-back"
          size={30}
          color={isFirstVerse ? "gray" : "black"}
        />
      </TouchableOpacity>
      {children}
      <TouchableOpacity
        style={styles.button}
        onPress={onNext}
        disabled={isLastVerse}
      >
        <Icon
          name="arrow-forward"
          size={30}
          color={isLastVerse ? "gray" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    backgroundColor: "#ffffff",
    height: 80,
    width: "75%",
  },
  button: {
    marginHorizontal: 8,
  },
});

export default VerseNavigation;
