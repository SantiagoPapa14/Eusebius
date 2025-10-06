import React from "react";
import { View, ImageBackground, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import NavButton from "../components/home/NavButton";
import { showMessage } from "react-native-flash-message";

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
            text="Lecturas"
            onPress={() => navigation.navigate("Lecturas")}
            icon="book-open"
          />
          <NavButton
            text="Profesor"
            disabled
            onPress={() =>
              showMessage({
                type: "info",
                message: "Estoy trabajando en ello!",
              })
            }
            icon="user"
          />
          <NavButton
            text="Cartas"
            onPress={() => navigation.navigate("Cartas")}
            icon="layers"
          />
          <NavButton
            text="Vocabulario"
            onPress={() => navigation.navigate("Vocabulario")}
            icon="archive"
          />
          <NavButton
            text="Bibla"
            onPress={() => navigation.navigate("Biblia")}
            icon="book"
          />
          <NavButton
            text="Cerrar Sesion"
            onPress={() => onLogout!()}
            icon="log-out"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
