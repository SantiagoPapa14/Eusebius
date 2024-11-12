import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import { enableScreens } from "react-native-screens";
import { Text, TouchableOpacity } from "react-native";
enableScreens();

import LoginScreen from "./screens/LoginScreen";

import HomeScreen from "./screens/HomeScreen";
import ReadingScreen from "./screens/ReadingScreen";
import KnowledgeScreen from "./screens/VocabularyScreen";
import FlashcardScreen from "./screens/FlashcardScreen";
import ProfessorScreen from "./screens/ProfessorScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import VocabularyScreen from "./screens/VocabularyScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <Layout></Layout>
      <FlashMessage position="bottom" />
    </AuthProvider>
  );
}

export const Layout = () => {
  const { authState, onLogout } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Readings" component={ReadingScreen} />
            <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
            <Stack.Screen name="Flashcards" component={FlashcardScreen} />
            <Stack.Screen name="Professor" component={ProfessorScreen} />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
