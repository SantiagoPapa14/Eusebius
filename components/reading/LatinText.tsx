import React from "react";
import {
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { hideMessage, showMessage } from "react-native-flash-message";

interface LatinTextProps {
  content: string;
  fadeAnim?: Animated.Value;
  slideAnim: Animated.Value;
  setDefinitionData: any;
  setDefinitionIsOpen: any;
}

const LatinText: React.FC<LatinTextProps> = ({
  content,
  fadeAnim,
  slideAnim,
  setDefinitionData,
  setDefinitionIsOpen,
}) => {
  const { width } = useWindowDimensions();

  let fontSize = 18;
  if (width >= 768) fontSize = 22;
  if (width >= 1200) fontSize = 28;

  const renderText = () => {
    return content.split(" ").map((word, index) => (
      <TouchableOpacity
        key={index}
        onPress={() =>
          handleWordPress(word, setDefinitionData, setDefinitionIsOpen)
        }
      >
        <Text style={[styles.word, { fontSize }]}>{word} </Text>
      </TouchableOpacity>
    ));
  };

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
      {content !== "" ? (
        <View style={styles.textContainer}>{renderText()}</View>
      ) : (
        <Text style={[styles.text, { fontSize }]}>
          Todavía no hemos descargado esta parte.
        </Text>
      )}
    </Animated.View>
  );
};

const handleWordPress = async (
  latinWord: string,
  setDefinitionData: any,
  setDefinitionIsOpen: any,
) => {
  showMessage({
    message: "Cargando traducción...",
    type: "info",
  });

  const cleanLatinWord = replaceSpecialChars(
    latinWord
      .replaceAll(":", "")
      .replaceAll(",", "")
      .replaceAll(".", "")
      .replaceAll("!", "")
      .replaceAll("?", "")
      .replaceAll("«", "")
      .replaceAll("»", "")
      .replace(/[^\p{L}]/gu, "")
      .trim(),
  );

  const url = `http://10.0.1.100:8000/analyze?word=${cleanLatinWord}`;
  const response = await fetch(url);
  const { word, lemma, pos, definition } = await response.json();

  setDefinitionData({
    short_name: lemma,
    full_name: cleanLatinWord,
    translation: definition,
  });

  setDefinitionIsOpen(true);
  hideMessage();
};

function replaceSpecialChars(str: string) {
  const specialChars: Record<string, string> = {
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
    (match) => specialChars[match],
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 600,
  },
  text: {
    textAlign: "center",
  },
  word: {
    marginRight: 4,
  },
});

export default LatinText;
