import React from "react";
import { Button } from "react-native";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Button title="Readings" onPress={() => navigation.navigate("Readings")} />
  );
};

export default HomeScreen;
