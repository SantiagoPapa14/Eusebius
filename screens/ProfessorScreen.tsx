import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Markdown from "react-native-markdown-display";
import { sendMessage, resetConversation } from "../scripts/geminiMiddleman";

resetConversation();

type message = {
  id: number;
  text: string;
  sender: string;
};

const ProfessorScreen = () => {
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<message[]>([
    {
      id: 1,
      text: "Hi there! I'm your Latin professor, what do you need help with today? 😇",
      sender: "bot",
    },
  ]);

  const flatListRef = useRef<FlatList>(null); // Ref for FlatList
  const typingAnimation = useRef(new Animated.Value(1)).current; // Animation for "Typing..." pulsing effect

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
      flatListRef.current?.scrollToEnd({ animated: true });
      // Show the typing indicator
      setIsTyping(true);

      // Start the pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate the bot response (you can remove this in production)
      const response = await sendMessage(message);

      // Then, update the messages with the bot's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: response, sender: "bot" },
      ]);

      // Hide the typing indicator
      setIsTyping(false);

      // Stop the pulsing animation
      typingAnimation.stopAnimation();

      // Scroll to the bottom
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
            ref={flatListRef} // Attach the ref to the FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
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

          {/* Display Typing... if bot is typing */}
          {isTyping && (
            <View className="flex-row justify-start mb-4">
              <View className="rounded-lg border border-gray-300 mx-4 bg-gray-200 p-4 max-w-[75%]">
                <Animated.Text
                  style={{
                    color: "gray",
                    fontSize: 16,
                    opacity: typingAnimation,
                  }}
                >
                  Typing...
                </Animated.Text>
              </View>
            </View>
          )}

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
