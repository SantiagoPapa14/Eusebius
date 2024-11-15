import React, { useEffect } from "react";
import BookSelector from "../components/bible/BookSelector";
import ChapterSelector from "../components/bible/ChapterSelector";
import ChapterReader from "../components/bible/ChapterReader";
import Icon from "react-native-vector-icons/Feather";
import { localBookData } from "../constants/EusebiusTypes";
import { TouchableOpacity } from "react-native";

const BibleScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [book, setBook] = React.useState<localBookData>();
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
        : "Bible",
      headerLeft: () => (
        <TouchableOpacity
          className="h-12 w-12 flex justify-center items-center mx-4 my-2"
          onPressIn={handleGoBack}
        >
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [book, chapter]);

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
