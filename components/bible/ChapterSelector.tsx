import React from "react";
import {
  View,
  ImageBackground,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ChapterList = ({
  book,
  setChapter,
}: {
  book: any;
  setChapter: Function;
}) => {
  return (
    <View style={styles.chapterListContainer}>
      {Array.from({ length: Number(book.Chapters) }).map((_, i) => (
        <TouchableOpacity
          key={i}
          style={styles.chapterButton}
          onPress={() => setChapter(i + 1)}
        >
          <Text style={styles.chapterText}>{(i + 1).toString()}</Text>
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
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/MichaelWpp.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent} // ← cambio aquí
        >
          <Text style={styles.bookTitle}>{book.Book}</Text>
          <ChapterList book={book} setChapter={setChapter} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    opacity: 0.2,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContent: {
    alignItems: "center",
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  bookTitle: {
    textAlign: "center",
    padding: 20,
    fontSize: 42,
    fontFamily: "Coursive",
  },
  chapterListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 700,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  chapterButton: {
    width: 64,
    height: 64,
    backgroundColor: "white",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 18,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chapterText: {
    textAlign: "center",
  },
});

export default ChapterSelector;
