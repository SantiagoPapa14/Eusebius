import React from "react";
import { View, ImageBackground, Image, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import NavButton from "../components/home/NavButton";
import { showMessage } from "react-native-flash-message";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { onLogout } = useAuth();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        style={[
          styles.background,
          { opacity: 0.2, height: "100%", width: "100%" },
        ]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/LogoHQ.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.navContainer}>
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
                message: "Esta funcionalidad no esta disponible por el momento",
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
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
  },
  logoContainer: {
    height: "20%",
    marginTop: 32,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  navContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    alignItems: "center",
    maxWidth: 600,
    alignSelf: "center",
  },
});

export default HomeScreen;
