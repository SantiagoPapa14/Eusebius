import React from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

const MenuButton: React.FC<{ page: string; iconName: string }> = ({
  page,
  iconName,
}) => {
  const navigation = useNavigation(); // Make sure to import and use useNavigation from react-navigation

  return (
    <TouchableOpacity
      className="flex-row h-20 justify-center items-center bg-white rounded-full mx-10 pl-10"
      onPress={() => navigation.navigate(page)}
    >
      <Icon name={iconName} size={60} color={"black"} />
      <Text className="flex-1 ml-10 text-4xl">{page}</Text>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.1 }}
      />
      <View
        className="flex-1 flex justify-center space-y-10 pt-10 pb-20"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View className="flex-1 justify-center items-center bg-white rounded-full mx-5 px-10 border">
          <Image
            source={require("../assets/eusebiusLogo.png")}
            className="w-full h-full object-cover rounded-full"
          />
        </View>
        <View className="flex-1">
          <MenuButton page={"Readings"} iconName={"book-open"} />
        </View>
        <View className="flex-1">
          <MenuButton page={"Professor"} iconName={"user"} />
        </View>
        <View className="flex-1">
          <MenuButton page={"Review"} iconName={"trending-up"} />
        </View>
        <View className="flex-1">
          <MenuButton page={"Knowledge"} iconName={"archive"} />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
