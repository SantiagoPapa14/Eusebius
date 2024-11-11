import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Markdown from "react-native-markdown-display";
import { sendMessage, resetConversation } from "../scripts/geminiMiddleman";

type message = {
  id: number;
  text: string;
  sender: string;
};

const ProfessorScreen = () => {
  resetConversation();
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<message[]>([
    {
      id: 1,
      text: "Hi there! I'm your Latin professor, what do you need help with today? 😇",
      sender: "bot",
    },
  ]);

  const handleSend = async () => {
    if (message.trim()) {
      // First, update the messages with the user's message
      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          { id: prevMessages.length + 1, text: message, sender: "user" },
        ];
        return newMessages;
      });

      setMessage("");
      const response = await sendMessage(message);

      // Then, update the messages with the bot's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: response, sender: "bot" },
      ]); // Clear the input field
    }
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.15 }}
      />
      <View
        className="w-full h-full"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View className="flex-1">
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                className={`flex-row ${
                  item.sender === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <View
                  className={`rounded-lg border border-gray-300 mx-4 ${
                    item.sender === "user" ? "bg-white" : "bg-gray-200"
                  } p-4 max-w-[75%]`}
                >
                  <Markdown style={{ text: { fontSize: 16 } }}>
                    {item.text}
                  </Markdown>
                </View>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          />

          <View className="flex-row items-center bg-white border-t border-gray-300 p-4">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message"
              className="flex-1 bg-white p-3 rounded-lg shadow-lg border border-gray-300"
            />
            <TouchableOpacity
              onPress={handleSend}
              className="ml-4 bg-gray-400 p-3 rounded-full flex justify-center items-center"
            >
              <Icon name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfessorScreen;
