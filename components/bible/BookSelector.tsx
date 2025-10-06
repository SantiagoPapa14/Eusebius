import React from "react";
import {
  View,
  ImageBackground,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { newTestament, oldTestament } from "../../constants/Books";

const BookList = ({ books, setBook }: { books: any; setBook: Function }) => {
  return (
    <View style={styles.bookListContainer}>
      {books.map((book: any, index: number) => (
        <TouchableOpacity
          key={book.Book || index}
          style={styles.bookButton}
          onPress={() => setBook(book)}
        >
          <Text style={styles.bookText}>{book.Book}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const BookSelector = ({ setBook }: { setBook: Function }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/MichaelWpp.jpg")}
        style={[styles.background, { opacity: 0.2 }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <ScrollView>
          <Text style={styles.heading}>Antiguo Testamento</Text>
          <BookList books={oldTestament} setBook={setBook} />
          <Text style={styles.heading}>Nuevo Testamento</Text>
          <BookList books={newTestament} setBook={setBook} />
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  bookListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  bookButton: {
    width: "33.333333%",
    height: 64,
    backgroundColor: "#ffffff",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#9ca3af",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookText: {
    textAlign: "center",
  },
  heading: {
    textAlign: "center",
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    fontFamily: "Coursive",
    fontSize: 42,
  },
  bottomSpacer: {
    height: 160,
  },
});

export default BookSelector;
