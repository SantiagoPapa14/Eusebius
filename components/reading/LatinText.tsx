import { Text, Animated, TouchableOpacity } from "react-native";
import { hideMessage, showMessage } from "react-native-flash-message";
import React, { FC } from "react";
interface LatinTextProps {
  content: string;
  fadeAnim?: Animated.Value;
  slideAnim: Animated.Value;
  setDefinitionData: any;
  setDefinitionIsOpen: any;
}

const renderText = (
  content: string,
  setDefinitionData: any,
  setDefinitionIsOpen: any,
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
  setDefinitionIsOpen: any,
) => {
  showMessage({
    message: "Cargando traducción...",
    type: "info",
  });

  const cleanWord = replaceSpecialChars(
    word
      .replaceAll(":", "")
      .replaceAll(",", "")
      .replaceAll(".", "")
      .replaceAll("!", "")
      .replaceAll("?", "")
      .replaceAll("«", "")
      .replace(/[^\p{L}]/gu, "")
      .trim(),
  );

  const url = `https://www.didacterion.com/esddbslt.php?palabra=${cleanWord}`;
  const response = await fetch(url);
  const html = await response.text();

  const { full_name, translation } = extractDataFromHtml(html);

  setDefinitionData({
    short_name: cleanWord,
    full_name,
    translation,
  });
  setDefinitionIsOpen(true);
  hideMessage();
};

function extractDataFromHtml(html: string) {
  const full_name = html.match(
    /<input[^>]*id=['"]forpal1['"][^>]*value=['"]([^'"]*)/,
  );
  const translation = html.match(
    /<input[^>]*id=['"]sigpal1['"][^>]*value=['"]([^'"]*)/,
  );

  return {
    full_name: full_name ? full_name[1] : "",
    translation: translation ? translation[1] : "",
  };
}

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
    (match) => specialChars[match as keyof typeof specialChars],
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
        opacity: fadeAnim ?? 1,
        transform: [{ translateX: slideAnim }],
      }}
      className="flex-1 items-center justify-center w-screen pr-5 pl-5"
    >
      <Text className="text-lg text-center">
        {renderText(content, setDefinitionData, setDefinitionIsOpen)}
      </Text>
    </Animated.View>
  );
};

export default LatinText;
