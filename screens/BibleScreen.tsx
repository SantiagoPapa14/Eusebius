import React, { useEffect } from "react";
import BookSelector from "../components/bible/BookSelector";
import ChapterSelector from "../components/bible/ChapterSelector";
import ChapterReader from "../components/bible/ChapterReader";
import Icon from "react-native-vector-icons/Feather";
import { localBookData } from "../constants/EusebiusTypes";

const BibleScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [book, setBook] = React.useState<localBookData>();
  const [chapter, setChapter] = React.useState();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: book
        ? chapter
          ? `${book.Book} ${chapter}`
          : `${book.Book}`
        : "Bible", // Use the state variable as the header title
      headerLeft: () => (
        <Icon
          name="arrow-left"
          size={24}
          color="black"
          style={{ margin: 10 }}
          onPress={() => {
            if (book) {
              if (chapter) {
                setChapter(undefined);
              } else {
                setBook(undefined);
              }
            } else {
              navigation.goBack();
            }
          }}
        />
      ),
    });
  }, [book, chapter, navigation]);

  if (book) {
    if (chapter) {
      return <ChapterReader book={book.Book} chapter={chapter} />;
    } else {
      return <ChapterSelector book={book} setChapter={setChapter} />;
    }
  } else {
    return <BookSelector setBook={setBook} />;
  }
};

export default BibleScreen;
