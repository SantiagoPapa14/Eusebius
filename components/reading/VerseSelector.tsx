import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Make sure to import your Icon component

interface VerseNavigationProps {
  isFirstVerse: boolean;
  isLastVerse: boolean;
  onNext: () => void;
  onPrevious: () => void;
  children?: React.ReactNode; // Add children prop
}

const VerseNavigation: React.FC<VerseNavigationProps> = ({
  isFirstVerse,
  isLastVerse,
  onNext,
  onPrevious,
  children,
}) => {
  return (
    <View className="flex-row justify-center items-center rounded-full bg-white h-20 w-3/4">
      <TouchableOpacity
        className="mx-2"
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
        className="mx-2"
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

export default VerseNavigation;
