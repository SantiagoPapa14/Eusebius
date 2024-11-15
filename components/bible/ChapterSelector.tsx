import React from "react";
import {
  View,
  ImageBackground,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const ChapterList = ({
  book,
  setChapter,
}: {
  book: any;
  setChapter: Function;
}) => {
  return (
    <View className="flex flex-row flex-wrap items-center justify-center">
      {Array.from({ length: Number(book.Chapters) }).map((_, i) => (
        <TouchableOpacity
          key={i}
          className="w-16 h-16 bg-white rounded rounded-full flex justify-center items-center mx-4 my-2 shadow shadow-lg shadow-gray-400"
          onPress={() => setChapter(i + 1)}
        >
          <Text className="text-center">{(i + 1).toString()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ChapterSelector = ({
  book,
  setChapter,
}: {
  book: any;
  setChapter: Function;
}) => {
  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.2 }}
      />
      <View
        className="w-screen h-screen"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <ScrollView>
          <Text
            className="text-center flex-1 p-5"
            style={{ fontFamily: "Coursive", fontSize: 42 }}
          >
            {book.Book}
          </Text>
          <ChapterList book={book} setChapter={setChapter} />
          <View className="h-40" />
        </ScrollView>
      </View>
    </View>
  );
};

export default ChapterSelector;
