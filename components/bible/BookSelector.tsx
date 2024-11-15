import React from "react";
import {
  View,
  ImageBackground,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { newTestament, oldTestament } from "../../constants/Books";

const BookList = ({ books, setBook }: { books: any; setBook: Function }) => {
  return (
    <View className="flex flex-row flex-wrap items-center justify-center">
      {books.map((book: any, index: number) => (
        <TouchableOpacity
          key={book.Book || index}
          className="w-1/3 h-16 bg-white rounded rounded-full flex justify-center items-center mx-4 my-2 shadow shadow-lg shadow-gray-400"
          onPress={() => setBook(book)}
        >
          <Text className="text-center">{book.Book}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const BookSelector = ({ setBook }: { setBook: Function }) => {
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
            className="text-center flex-1 pt-5"
            style={{ fontFamily: "Coursive", fontSize: 42 }}
          >
            Old Testament
          </Text>
          <BookList books={oldTestament} setBook={setBook} />
          <Text
            className="text-center flex-1 p-5"
            style={{ fontFamily: "Coursive", fontSize: 42 }}
          >
            New Testament
          </Text>
          <BookList books={newTestament} setBook={setBook} />
          <View className="h-40" />
        </ScrollView>
      </View>
    </View>
  );
};

export default BookSelector;
