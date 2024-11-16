import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useAuth } from "../context/AuthContext";

type TableData = {
  id: number;
  word: string;
  definition: string;
};

const VocabularyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { secureFetch } = useAuth();
  if (!secureFetch) return null;
  const [data, setData] = useState<TableData[]>([]); // state to hold the fetched data
  const [loading, setLoading] = useState<boolean>(true); // loading state
  const [error, setError] = useState<string | null>(null); // error state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalWord, setModalWord] = useState("");
  const [modalDefinition, setModalDefinition] = useState("");
  const [selectedWordId, setSelectedWordId] = useState(-1);

  useEffect(() => {
    // Create an async function to fetch the data
    const fetchData = async () => {
      try {
        // Example API call
        const result = await secureFetch(`/words`);
        setData(result as TableData[]); // Set the data into the state
      } catch (error: any) {
        setError(error.message); // Set error if the fetch fails
      } finally {
        setLoading(false); // Set loading to false when the request is complete
      }
    };

    fetchData(); // Call the async function
  }, []);

  const renderItem = ({ item }: { item: TableData }) => (
    <View className="flex-row mt-1 mb-1 items-center">
      <TouchableOpacity
        onPress={() => {
          setModalWord(item.word);
          setModalDefinition(item.definition);
          setSelectedWordId(item.id);
          setModalVisible(true);
        }}
        className="bg-white py-2 opacity-80 m-1 rounded-lg border shadow border-gray-200 flex-1 flex-row"
      >
        <Text className="flex-1 text-center text-lg">
          {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModalWord(item.word);
          setModalDefinition(item.definition);
          setSelectedWordId(item.id);
          setModalVisible(true);
        }}
        className="bg-white py-2 opacity-80 m-1 rounded-lg border shadow border-gray-200 flex-1 flex-row"
      >
        <Text className="flex-1 text-center text-lg">{item.definition}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-10 h-10 m-1 bg-white rounded-full border shadow border-gray-200 flex justify-center items-center"
        onPress={async () => {
          await secureFetch(`/words/${item.word}`, {
            method: "DELETE",
          });
          setData(data.filter((word) => word.word !== item.word));
        }}
      >
        <Icon name={"trash-2"} size={18} color={"red"} />
      </TouchableOpacity>
    </View>
  );

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
          </View>
          <Text className="text-center text-gray-500 text-lg mt-5 mx-5">
            You can click any words within readings to get the definition, there
            you can also add it to your vocabulary and it will be saved here!
          </Text>
        </View>
      </View>
    );
  }

  const handleWordUpdate = async () => {
    await secureFetch(`/words/${selectedWordId}`, {
      method: "PATCH",
      body: JSON.stringify({ word: modalWord, definition: modalDefinition }),
    });
    const newData = data.map((word) => {
      if (word.id === selectedWordId) {
        return { ...word, word: modalWord, definition: modalDefinition };
      }
      return word;
    });
    setData(newData);
    setModalVisible(false);
  };

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
          <View className="flex-row bg-gray-100 py-2 border-b border-gray-300 mr-12">
            <Text className="flex-1 font-bold text-center text-lg">Word</Text>
            <Text className="flex-1 font-bold text-center text-lg">
              Definition
            </Text>
          </View>

          <FlatList
            className="mt-5"
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setSelectedWordId(-1);
              setModalWord("");
              setModalDefinition("");
            }}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="w-4/5 bg-white rounded-lg p-6">
                <Text className="text-lg font-bold mb-4">Word:</Text>
                <TextInput
                  placeholder="Word"
                  value={modalWord}
                  onChangeText={(text) => setModalWord(text)}
                  className="border border-gray-300 rounded-lg p-2 mb-4"
                ></TextInput>
                <Text className="text-lg font-bold mb-4">Definition:</Text>
                <TextInput
                  placeholder="Definition"
                  value={modalDefinition}
                  onChangeText={(text) => setModalDefinition(text)}
                  className="border border-gray-300 rounded-lg p-2 mb-4"
                ></TextInput>
                <View className="flex-row flex items-center justify-center space-x-10">
                  <TouchableOpacity
                    className="px-4 py-2 bg-gray-400 rounded-lg w-2/5"
                    onPress={() => handleWordUpdate()}
                  >
                    <Text className="text-white text-center font-bold">
                      Save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-4 py-2 bg-gray-500 rounded-lg w-2/5"
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedWordId(-1);
                      setModalWord("");
                      setModalDefinition("");
                    }}
                  >
                    <Text className="text-white text-center font-bold">
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default VocabularyScreen;
