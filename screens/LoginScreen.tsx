import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
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
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        style={[styles.background, { opacity: 0.1 }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/LogoHQ.png")}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo"
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={register}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    height: "20%",
    width: "100%",
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 8,
    width: "66.666667%",
    marginTop: 20,
  },
  input: {
    padding: 8,
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#9ca3af",
    borderRadius: 8,
    padding: 16,
    margin: 8,
  },
  buttonText: {
    color: "#ffffff",
  },
});

export default LoginScreen;
