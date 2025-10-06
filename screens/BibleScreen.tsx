import React, { useEffect } from "react";
import BookSelector from "../components/bible/BookSelector";
import ChapterSelector from "../components/bible/ChapterSelector";
import ChapterReader from "../components/bible/ChapterReader";
import Icon from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native";

const SWIPE_THRESHOLD = 30;

const ANIMATION_DURATION = 200;
const SLIDE_DISTANCE = 600;

const ANIMATION_CONFIG = {
  duration: ANIMATION_DURATION,
  useNativeDriver: true,
};

const BibleScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [book, setBook] = React.useState<{ Book: string; Key: string }>();
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
      return <ChapterReader book={book} chapter={chapter} />;
    } else {
      return <ChapterSelector book={book} setChapter={setChapter} />;
    }
  } else {
    return <BookSelector setBook={setBook} />;
  }
};

export default BibleScreen;
