import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import { enableScreens } from "react-native-screens";
enableScreens();

import HomeScreen from "./screens/HomeScreen";
import ReadingScreen from "./screens/ReadingScreen";
import KnowledgeScreen from "./screens/KnowledgeScreen";
import FlashcardScreen from "./screens/FlashcardScreen";
import ProfessorScreen from "./screens/ProfessorScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Readings" component={ReadingScreen} />
          <Stack.Screen name="Knowledge" component={KnowledgeScreen} />
          <Stack.Screen name="Flashcards" component={FlashcardScreen} />
          <Stack.Screen name="Professor" component={ProfessorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="bottom" />
    </>
  );
}
