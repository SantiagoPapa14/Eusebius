import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import ReadingScreen from "./screens/ReadingScreen";
import KnowledgeScreen from "./screens/KnowledgeScreen";
import FlashMessage from "react-native-flash-message";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <SQLiteProvider
        databaseName="eusebius.db"
        assetSource={{ assetId: require("./assets/eusebius.db") }}
      >
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Readings" component={ReadingScreen} />
            <Stack.Screen name="Knowledge" component={KnowledgeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <FlashMessage position="bottom" />
      </SQLiteProvider>
    </>
  );
}
