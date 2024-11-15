import React from "react";
import { View, ImageBackground, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { showMessage } from "react-native-flash-message";
import NavButton from "../components/home/NavButton";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { onLogout } = useAuth();
  return (
    <View className="flex-1">
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
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
