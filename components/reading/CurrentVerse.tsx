import { Text, Animated } from "react-native";
import { readingType } from "../../constants/EusebiusTypes";

interface CurrentVerseProps {
  reading: readingType;
  selectedVerse: number;
  fadeAnim: Animated.Value;
}

const CurrentVerse: React.FC<CurrentVerseProps> = ({
  reading,
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
      <Text className="flex text-lg items-center text-center">{`${
        reading.book
      } ${reading.chapter}:${reading.verses.start + selectedVerse}`}</Text>
    </Animated.View>
  );
};

export default CurrentVerse;
