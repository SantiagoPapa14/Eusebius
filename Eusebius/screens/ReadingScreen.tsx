import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ReadingScreen = () => {
  const [latinReadings, setLatinReadings] = React.useState({});
  const [englishReadings, setEnglishReadings] = React.useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verse, setVerse] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const readingsResponse = await fetch(
          `http://10.0.0.55:3000/readings?translated=false&includeContent=true`
        );
        if (!readingsResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const readingsJson = await readingsResponse.json();
        setLatinReadings(readingsJson);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <Text>Error: {error}</Text>; // Render error state
  }

  if (loading) {
    return <Text>Loading...</Text>; // Render loading state
  }

  return (
    <ImageBackground
      source={require("../assets/MichaelWpp.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-gray-100 opacity-95">
        <View className="flex-1 h-screen items-center justify-center bg-gbGray">
          <View className="flex-1 items-center justify-center w-screen mt-10">
            <Text className="text-lg text-center">
              {JSON.stringify(latinReadings.gospel.verses.content)}
            </Text>
          </View>
          <View className="flex-row justify-center items-center rounded-full bg-white h-20 w-3/4">
            <TouchableOpacity className="mx-2">
              <Icon name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
            <Text className="flex-1 text-lg text-center">2 Timothy 4:11</Text>
            <TouchableOpacity className="mx-2">
              <Icon name="arrow-forward" size={30} color="#000" />
            </TouchableOpacity>
          </View>
          <View className="flex-1 items-center justify-center w-screen mb-10">
            <Text className="text-lg text-center">
              Luke alone is with me. Take Mark and bring him with you; for he is
              useful to me in the ministry.
            </Text>
          </View>
          <View className="flex-row justify-center items-center bg-white h-20 w-screen">
            <TouchableOpacity className="flex-1 items-center justify-center h-20">
              <Text>Psalm</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center justify-center h-20">
              <Text>Gospel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center justify-center h-20">
              <Text>Reading</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ReadingScreen;
