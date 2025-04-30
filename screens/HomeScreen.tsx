import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import NavButton from "../components/home/NavButton";
import Icon from "react-native-vector-icons/Feather";
import DropdownPicker from "../components/settings/DropdownPicker";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { onLogout } = useAuth();
  const [showSettings, setShowSettings] = React.useState(false);
  const [sourceLanguage, setSourceLanguage] = React.useState("English");
  const [targetLanguage, setTargetLanguage] = React.useState("Latin");

  return (
    <View className="flex-1">
      <Modal transparent animationType="fade" visible={showSettings}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-6 rounded-2xl w-4/5 shadow-lg">
            <Text className="text-lg font-bold mb-4">Source Language</Text>

            <DropdownPicker
              options={[
                { label: "English", value: "English" },
                { label: "Spanish", value: "Spanish" },
                { label: "Latin", value: "Latin" },
                { label: "Italian", value: "Italian" },
              ]}
              selectedValue={sourceLanguage}
              onValueChange={setSourceLanguage}
            />
            <Text className="text-lg font-bold mb-4">Target Language</Text>

            <DropdownPicker
              options={[
                { label: "English", value: "English" },
                { label: "Spanish", value: "Spanish" },
                { label: "Latin", value: "Latin" },
                { label: "Italian", value: "Italian" },
              ]}
              selectedValue={targetLanguage}
              onValueChange={setTargetLanguage}
            />
            <View className="w-full flex flex-row justify-between">
              <TouchableOpacity
                onPress={onLogout}
                className="p-3 w-1/3 flex items-center justify-center mt-6 bg-gray-200 rounded-full"
              >
                <View className="flex flex-row gap-2">
                  <Icon name="log-out" size={16} color="black" />
                  <Text>Logout</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowSettings(false)}
                className="p-3 w-1/3 flex items-center justify-center mt-6 bg-gray-200 rounded-full"
              >
                <View className="flex flex-row gap-2">
                  <Icon name="save" size={16} color="black" />
                  <Text>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.2 }}
      />
      <View
        className="w-screen h-screen"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View className="h-1/5 mt-16">
          <Image
            source={require("../assets/LogoHQ.png")}
            className="w-full h-full object-cover"
          />
        </View>
        <View className="flex-1 flex-wrap flex-row justify-center items-center">
          <NavButton
            text="Readings"
            onPress={() => navigation.navigate("Readings")}
            icon="book-open"
          />
          <NavButton
            text="Professor"
            onPress={() => navigation.navigate("Professor")}
            icon="user"
          />
          <NavButton
            text="Flashcards"
            onPress={() => navigation.navigate("Flashcards")}
            icon="layers"
          />
          <NavButton
            text="Vocabulary"
            onPress={() => navigation.navigate("Vocabulary")}
            icon="archive"
          />
          <NavButton
            text="Bible"
            onPress={() => navigation.navigate("Bible")}
            icon="book"
          />
          <NavButton
            text="Settings"
            onPress={() => setShowSettings(true)}
            icon="settings"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
