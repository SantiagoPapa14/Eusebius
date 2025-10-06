import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface Props {
  text: string;
  onPress: () => void;
  icon: string;
  disabled?: boolean;
}

const NavButton = ({ text, onPress, icon, disabled = false }: Props) => {
  return (
    <View className="w-40 h-40 m-3 shadow shadow-lg">
      <TouchableOpacity
        className={
          "flex-1 flex justify-center items-center rounded-xl" +
          (disabled ? " bg-gray-400 opacity-50" : " bg-white")
        }
        onPress={onPress}
        style={{
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
        }}
      >
        <Icon name={icon} size={80} color={"black"} />
        <Text className="text-2xl">{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavButton;
