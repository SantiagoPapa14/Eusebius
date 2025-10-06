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
import { Word } from "../constants/EusebiusTypes";
import { showMessage } from "react-native-flash-message";

const VocabularyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { secureFetch } = useAuth();
  if (!secureFetch) return null;
  const [data, setData] = useState<Word[]>([]);
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
        const result = await secureFetch(`/word/all`);
        setData(result as Word[]);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the async function
  }, []);

  const renderItem = ({ item }: { item: Word }) => (
    <View className="flex-row mt-1 mb-1 items-center">
      <TouchableOpacity
        onPress={() => {
          setModalWord(item.text);
          setModalDefinition(item.translation);
          setSelectedWordId(item.id);
          setModalVisible(true);
        }}
        className="bg-white py-2 opacity-80 m-1 rounded-lg border shadow border-gray-200 flex-1 flex-row"
      >
        <Text className="flex-1 text-center text-lg">
          {item.text.charAt(0).toUpperCase() + item.text.slice(1)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModalWord(item.text);
          setModalDefinition(item.translation);
          setSelectedWordId(item.id);
          setModalVisible(true);
        }}
        className="bg-white py-2 opacity-80 m-1 rounded-lg border shadow border-gray-200 flex-1 flex-row"
      >
        <Text className="flex-1 text-center text-lg">{item.translation}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-10 h-10 m-1 bg-white rounded-full border shadow border-gray-200 flex justify-center items-center"
        onPress={() => handleWordDelete(item)}
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

  const handleWordSave = async () => {
    const method = selectedWordId === -1 ? "POST" : "PUT";

    const res = await secureFetch(`/word`, {
      method,
      body: JSON.stringify({
        id: selectedWordId === -1 ? undefined : selectedWordId,
        text: modalWord,
        translation: modalDefinition,
      }),
    });

    if (method === "POST") {
      setData([
        ...data,
        {
          id: res.id,
          text: res.text,
          translation: res.translation,
        },
      ]);
      showMessage({
        message: "Palabra guardada",
        type: "info",
      });
    } else if (method === "PUT") {
      const newData = data.map((word) => {
        if (word.id === selectedWordId) {
          return { ...word, text: modalWord, translation: modalDefinition };
        }
        return word;
      });
      setData(newData);
      showMessage({
        message: "Palabra actualizada",
        type: "info",
      });
    }
    setModalVisible(false);
  };

  const handleWordDelete = async (word: Word) => {
    await secureFetch(`/word`, {
      method: "DELETE",
      body: JSON.stringify(word),
    });
    setData(data.filter((w) => w.id !== word.id));
    showMessage({
      message: "Palabra eliminada",
      type: "danger",
    });
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
            <Text className="flex-1 font-bold text-center text-lg">
              Palabra
            </Text>
            <Text className="flex-1 font-bold text-center text-lg">
              Significado
            </Text>
          </View>

          {data.length === 0 && (
            <Text className="text-center text-gray-500 text-lg mt-5 mx-5">
              Puedes clickear cualquier palabra dentro de las lecturas para ver
              su significado, luego puedes agregarla a tu vocabulario y se
              guardará aquí!
            </Text>
          )}

          <FlatList
            className="mt-5"
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />

          <View className="absolute w-screen h-screen flex items-end justify-end">
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                setModalWord("");
                setModalDefinition("");
                setSelectedWordId(-1);
              }}
              className="mb-32 mr-8 w-16 h-16 flex justify-center items-center bg-white opacity-80 rounded-full border shadow border-gray-200"
            >
              <Icon name={"plus"} size={18} color={"#000"} />
            </TouchableOpacity>
          </View>

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
                <Text className="text-lg font-bold mb-4">Palabra:</Text>
                <TextInput
                  placeholder="Palabra"
                  value={modalWord}
                  onChangeText={(text) => setModalWord(text)}
                  className="border border-gray-300 rounded-lg p-2 mb-4"
                ></TextInput>
                <Text className="text-lg font-bold mb-4">Significado:</Text>
                <TextInput
                  placeholder="Significado"
                  value={modalDefinition}
                  onChangeText={(text) => setModalDefinition(text)}
                  className="border border-gray-300 rounded-lg p-2 mb-4"
                ></TextInput>
                <View className="flex-row flex items-center justify-center space-x-10">
                  <TouchableOpacity
                    className="px-4 py-2 bg-gray-400 rounded-lg w-2/5"
                    onPress={() => handleWordSave()}
                  >
                    <Text className="text-white text-center font-bold">
                      Guardar
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
                      Cerrar
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
