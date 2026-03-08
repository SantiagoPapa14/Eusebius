import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import BookSelector from "../components/bible/BookSelector";
import ChapterSelector from "../components/bible/ChapterSelector";
import ChapterReader from "../components/bible/ChapterReader";
import Icon from "react-native-vector-icons/Feather";
import { LocalBook } from "../constants/EusebiusTypes";

const BibleScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [book, setBook] = React.useState<LocalBook>();
  const [chapter, setChapter] = React.useState();

  const handleGoBack = () => {
    if (book) {
      if (chapter) {
        setChapter(undefined);
      } else {
        setBook(undefined);
      }
    } else {
      navigation.goBack();
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: book
        ? chapter
          ? `${book.Book} ${chapter}`
          : `${book.Book}`
        : "Biblia",
      headerLeft: () => (
        <TouchableOpacity style={styles.backButton} onPressIn={handleGoBack}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [book, chapter]);

  if (book) {
    if (chapter) {
      return <ChapterReader book={book} chapter={chapter} />;
    } else {
      return <ChapterSelector book={book} setChapter={setChapter} />;
    }
  } else {
    return <BookSelector setBook={setBook} />;
  }
};

const styles = StyleSheet.create({
  backButton: {
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
  },
});

export default BibleScreen;
