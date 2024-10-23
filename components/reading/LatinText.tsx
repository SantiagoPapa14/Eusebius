import { Text, Animated, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

interface LatinTextProps {
  content: string;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  setDefinitionData: any;
  setDefinitionIsOpen: any;
}

const renderText = (
  content: string,
  setDefinitionData: any,
  setDefinitionIsOpen: any
) => {
  return content.split(" ").map((word, index) => (
    <TouchableOpacity
      key={index}
      onPress={() =>
        handleWordPress(word, setDefinitionData, setDefinitionIsOpen)
      }
    >
      <Text className="text-lg">{word} </Text>
    </TouchableOpacity>
  ));
};

const handleWordPress = async (
  word: string,
  setDefinitionData: any,
  setDefinitionIsOpen: any
) => {
  Toast.show({
    type: "info",
    text1: "Loading definition...",
  });

  const cleanWord = replaceSpecialChars(
    word
      .replaceAll(":", "")
      .replaceAll(",", "")
      .replaceAll(".", "")
      .replaceAll(" ", "")
  );

  const url = `https://www.latin-is-simple.com/api/vocabulary/search/?query=${cleanWord}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.length === 0) {
    Toast.show({
      type: "error",
      text1: "No translation found.",
    });
  } else {
    setDefinitionData(data[0]);
    await new Promise((r) => setTimeout(r, 500));
    setDefinitionIsOpen(true);
    Toast.hide();
  }
};

function replaceSpecialChars(str: string) {
  const specialChars = {
    æ: "ae",
    Æ: "AE",
    ø: "o",
    Ø: "O",
    å: "a",
    Å: "A",
    œ: "oe",
    Œ: "OE",
    þ: "th",
    Þ: "TH",
    ð: "d",
    Ð: "D",
    ü: "u",
    Ü: "U",
    ö: "o",
    Ö: "O",
    ß: "ss",
  };

  return str.replace(
    /æ|Æ|ø|Ø|å|Å|œ|Œ|þ|Þ|ð|Ð|ü|Ü|ö|Ö|ß/g,
    (match) => specialChars[match as keyof typeof specialChars]
  );
}

const LatinText: React.FC<LatinTextProps> = ({
  content,
  fadeAnim,
  slideAnim,
  setDefinitionData,
  setDefinitionIsOpen,
}) => {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
      className="flex-1 items-center justify-center w-screen mt-10 pr-5 pl-5"
    >
      <Text className="text-lg text-center">
        {renderText(content, setDefinitionData, setDefinitionIsOpen)}
      </Text>
    </Animated.View>
  );
};

export default LatinText;
