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
    <View
      style={{
        elevation: 5,
        shadowColor: "#000",
        width: 150,
        height: 150,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4.5,
        margin: 15,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          opacity: disabled ? 0.5 : 1,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
          backgroundColor: disabled ? "#D1D5DB" : "#FFF",
          borderRadius: 20,
        }}
      >
        <Icon name={icon} size={80} color={"black"} />
        <Text className="text-2xl">{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavButton;
