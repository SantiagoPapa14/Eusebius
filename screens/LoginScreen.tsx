import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, onRegister } = useAuth();

  const login = async () => {
    const data = await onLogin!(email, password);
    console.log(data);
  };

  const register = async () => {
    const data = await onRegister!(email, password);
    console.log(data);
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.1 }}
      />
      <View
        className="w-full h-full flex justify-center items-center"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View className="h-1/5 w-screen">
          <Image
            source={require("../assets/LogoHQ.png")}
            className="w-full h-full object-cover rounded-full"
          />
        </View>

        <View className="border border-gray-300 bg-white shadow-lg rounded-lg w-2/3 mt-5">
          <TextInput
            className="p-2"
            placeholder="Email"
            onChangeText={setEmail}
          />
        </View>
        <View className="border border-gray-300 bg-white shadow-lg rounded-lg w-2/3 mt-5">
          <TextInput
            className="p-2"
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>
        <View className="mt-5 flex flex-row">
          <TouchableOpacity
            className="bg-gray-400 rounded-lg p-4 m-2"
            onPress={login}
          >
            <Text className="text-white">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-400 rounded-lg p-4 m-2"
            onPress={register}
          >
            <Text className="text-white">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
