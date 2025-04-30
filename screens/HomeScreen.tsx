import React from "react";
import {
  View,
  TouchableOpacity,
  Button,
  Pressable,
  Text,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import NavButton from "../components/home/NavButton";
import Icon from "react-native-vector-icons/Feather";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { onLogout } = useAuth();
  const [showSettings, setShowSettings] = React.useState(false);
  return (
    <View className="flex-1">
      <Modal transparent animationType="fade" visible={showSettings}>
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowSettings(false)}
        >
          <View className="bg-white p-6 rounded-2xl w-4/5 shadow-lg">
            <Text className="text-lg font-bold mb-4">Hello from Modal</Text>
            <Button title="Close" onPress={() => setShowSettings(false)} />
          </View>
        </Pressable>
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
          <NavButton text="Logout" onPress={() => onLogout} icon="log-out" />
          <TouchableOpacity
            className="flex-row justify-center items-center gap-2 bg-white rounded-full pb-2 pr-2 shadow"
            onPress={() => setShowSettings(true)}
          >
            <Icon name="settings" size={40} color={"black"} />
            <Text>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
