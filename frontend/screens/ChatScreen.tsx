import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";

interface Message {
  id: string;
  text: string;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello!" },
    { id: "2", text: "Hi! How are you?" },
    { id: "3", text: "I’m good, thanks!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      const newMsg: Message = { id: Date.now().toString(), text: newMessage };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={tw`p-2 bg-white my-1 rounded-lg shadow`}>
            <Text style={tw`text-gray-800`}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={tw`p-4`}
      />
      <View style={tw`flex-row p-2 bg-white border-t border-gray-300`}>
        <TextInput
          style={tw`flex-1 border rounded-lg p-2`}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity
          style={tw`bg-blue-500 rounded-lg p-2 ml-2`}
          onPress={handleSend}
        >
          <Text style={tw`text-white`}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
