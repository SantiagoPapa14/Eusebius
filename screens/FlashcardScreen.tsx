import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Flashcard from "../components/flashcard/Flashcard";
import { useAuth } from "../context/AuthContext";

type TableData = {
  word: string;
  definition: string;
};

const FlashcardScreen = () => {
  const { secureFetch } = useAuth();
  if (!secureFetch) return null;
  const width = Dimensions.get("window").width;
  const [data, setData] = useState<TableData[]>([]); // state to hold the fetched data
  const [loading, setLoading] = useState<boolean>(true); // loading state
  const [error, setError] = useState<string | null>(null); // error state

  useEffect(() => {
    // Create an async function to fetch the data
    const fetchData = async () => {
      try {
        const result = (await secureFetch(`/words`)) as TableData[];
        const mixedData = result.sort(() => Math.random() - 0.5);
        setData(mixedData as TableData[]);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the async function
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{`Error: ${error}`}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View className="flex-1">
        <ImageBackground
          source={require("../assets/MichaelWpp.jpg")}
          className="flex-1"
          resizeMode="cover"
          style={{ opacity: 0.05 }}
        />
        <View
          className="w-full h-full flex items-center justify-center"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <View className="mb-20">
            <Text className="text-center text-gray-500 text-lg mt-5 m-5">
              You can click any words within readings to read the definition and
              save it, then come back to review them here!
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.15 }}
      />
      <View
        className="w-screen h-screen"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View className="flex-1 justify-center items-center">
          <Carousel
            loop
            width={width}
            autoPlay={false}
            data={data}
            // scrollAnimationDuration={500}
            renderItem={({ item }) => (
              <View className="p-6 mb-20 flex-1 flex justify-center items-center">
                <Flashcard front={item.word} back={item.definition} />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default FlashcardScreen;
