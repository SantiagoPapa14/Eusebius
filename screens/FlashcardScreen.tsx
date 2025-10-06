import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Flashcard from "../components/flashcard/Flashcard";
import { useAuth } from "../context/AuthContext";
import { Word } from "../constants/EusebiusTypes";

const FlashcardScreen = () => {
  const { secureFetch } = useAuth();
  if (!secureFetch) return null;

  const width = Dimensions.get("window").width;
  const [data, setData] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create an async function to fetch the data
    const fetchData = async () => {
      try {
        const result = await secureFetch(`/word/all`);
        const mixedData = result.sort(() => Math.random() - 0.5);
        setData(mixedData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{`Error: ${error}`}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/MichaelWpp.jpg")}
          style={[styles.background, { opacity: 0.05 }]}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessageText}>
              Puedes clickear cualquier palabra dentro de las lecturas para ver
              su significado, luego puedes agregarla a tu vocabulario y
              repasarla aquí!
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        style={[styles.background, { opacity: 0.15 }]}
        resizeMode="cover"
      />
      <View style={styles.fullScreenOverlay}>
        <View style={styles.carouselContainer}>
          <Carousel
            loop
            width={width}
            autoPlay={false}
            data={data}
            // scrollAnimationDuration={500}
            renderItem={({ item }) => (
              <View style={styles.flashcardWrapper}>
                <Flashcard front={item.text} back={item.translation} />
              </View>
            )}
          />
        </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ef4444",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMessageContainer: {
    marginBottom: 80,
  },
  emptyMessageText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 18,
    marginTop: 20,
    margin: 20,
  },
  fullScreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  carouselContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flashcardWrapper: {
    padding: 24,
    marginBottom: 80,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FlashcardScreen;
