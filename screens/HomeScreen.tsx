import React from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { showMessage } from "react-native-flash-message";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
        <View className="h-1/5 mt-28">
          <Image
            source={require("../assets/LogoHQ.png")}
            className="w-full h-full object-cover rounded-full"
          />
        </View>
        <View className="flex-1 flex items-center mt-8 mb-32 space-y-10">
          <View className="w-full flex flex-row justify-center items-center space-x-10">
            <TouchableOpacity
              className="w-40 h-40 bg-white flex justify-center items-center rounded-xl"
              onPress={() => navigation.navigate("Readings")}
              style={{
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.5,
              }}
            >
              <Icon name={"book-open"} size={80} color={"black"} />
              <Text className="text-2xl">Readings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-40 h-40 bg-white flex justify-center items-center rounded-xl"
              onPress={() => navigation.navigate("Professor")}
              style={{
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.5,
              }}
            >
              <Icon name={"user"} size={80} color={"black"} />
              <Text className="text-2xl">Professor</Text>
            </TouchableOpacity>
          </View>
          <View className="w-full flex flex-row justify-center items-center space-x-10">
            <TouchableOpacity
              className="w-40 h-40 bg-white flex justify-center items-center rounded-xl"
              onPress={() => navigation.navigate("Flashcards")}
              style={{
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.5,
              }}
            >
              <Icon name={"layers"} size={80} color={"black"} />
              <Text className="text-2xl">Flashcards</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-40 h-40 bg-white flex justify-center items-center rounded-xl"
              onPress={() => navigation.navigate("Knowledge")}
              style={{
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.5,
              }}
            >
              <Icon name={"archive"} size={80} color={"black"} />
              <Text className="text-2xl">Knowledge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
