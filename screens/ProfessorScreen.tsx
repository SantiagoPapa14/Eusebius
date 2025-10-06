import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Animated,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Markdown from "react-native-markdown-display";
import { useAuth } from "../context/AuthContext";

type message = {
  id: number;
  text: string;
  sender: string;
};

const ProfessorScreen = () => {
  const { secureFetch } = useAuth();
  if (!secureFetch) return null;
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<message[]>([
    {
      id: -1,
      text: "Hi there! I'm your Latin professor, what do you need help with today? 😇",
      sender: "bot",
    },
  ]);

  const flatListRef = useRef<FlatList>(null); // Ref for FlatList
  const typingAnimation = useRef(new Animated.Value(1)).current; // Animation for "Typing..." pulsing effect

  const handleSend = async () => {
    if (message.trim()) {
      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          { id: prevMessages.length + 1, text: message, sender: "You" },
        ];
        return newMessages;
      });

      setMessage("");
      flatListRef.current?.scrollToEnd({ animated: true });

      setIsTyping(true);
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
        ]),
      ).start();

      //Here is where the data transfer happens

      const history: string[] = [];
      messages.forEach((message) => {
        if (message.id !== -1)
          history.push(`${message.sender}: ${message.text}`);
      });

      const newResponse = await secureFetch(`/professor/sendMessage`, {
        method: "POST",
        body: JSON.stringify({ message: message, history: history }),
      });

      const response = newResponse.response;

      //Now cleanup

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: response, sender: "Model" },
      ]);
      setIsTyping(false);
      typingAnimation.stopAnimation();
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        style={[styles.background, { opacity: 0.15 }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef} // Attach the ref to the FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageRow,
                  item.sender === "You"
                    ? styles.messageRowEnd
                    : styles.messageRowStart,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "You"
                      ? styles.messageBubbleUser
                      : styles.messageBubbleBot,
                  ]}
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
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <Animated.Text
                  style={[
                    styles.typingText,
                    {
                      opacity: typingAnimation,
                    },
                  ]}
                >
                  Typing...
                </Animated.Text>
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message"
              style={styles.textInput}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Icon name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
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
  },
  chatContainer: {
    flex: 1,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  messageRowEnd: {
    justifyContent: "flex-end",
  },
  messageRowStart: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginHorizontal: 16,
    padding: 16,
    maxWidth: "75%",
  },
  messageBubbleUser: {
    backgroundColor: "#ffffff",
  },
  messageBubbleBot: {
    backgroundColor: "#e5e7eb",
  },
  typingContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  typingBubble: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginHorizontal: 16,
    backgroundColor: "#e5e7eb",
    padding: 16,
    maxWidth: "75%",
  },
  typingText: {
    color: "gray",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    padding: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  sendButton: {
    marginLeft: 16,
    backgroundColor: "#9ca3af",
    padding: 12,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfessorScreen;
