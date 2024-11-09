import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getWords } from "../scripts/sqliteLibrary";

type TableData = {
  word: string;
  definition: string;
};

const renderItem = ({ item }: { item: TableData }) => (
  <View key={item.word} className="flex-row py-2 border-b border-gray-300">
    <Text className="flex-1 text-center text-lg">{item.word}</Text>
    <Text className="flex-1 text-center text-lg">{item.definition}</Text>
  </View>
);

const KnowledgeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [data, setData] = useState<TableData[]>([]); // state to hold the fetched data
  const [loading, setLoading] = useState<boolean>(true); // loading state
  const [error, setError] = useState<string | null>(null); // error state

  useEffect(() => {
    // Create an async function to fetch the data
    const fetchData = async () => {
      try {
        // Example API call
        const result = await getWords();
        setData(result as TableData[]); // Set the data into the state
      } catch (error) {
        setError(error.message); // Set error if the fetch fails
      } finally {
        setLoading(false); // Set loading to false when the request is complete
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

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.05 }}
      />
      <View
        className="w-screen h-screen"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View className="p-4">
          {/* Table Header */}
          <View className="flex-row bg-gray-100 py-2 border-b border-gray-300">
            <Text className="flex-1 font-bold text-center text-lg">Word</Text>
            <Text className="flex-1 font-bold text-center text-lg">
              Definition
            </Text>
          </View>

          {/* Table Rows */}
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
          />
        </View>
      </View>
    </View>
  );
};

export default KnowledgeScreen;
