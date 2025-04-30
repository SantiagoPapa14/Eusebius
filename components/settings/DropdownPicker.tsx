import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";

const DropdownPicker = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select an option",
  style = {},
}: any) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find((opt: any) => opt.value === selectedValue)?.label ||
    placeholder;

  return (
    <View style={style}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="border border-gray-300 rounded-lg p-3 bg-white flex-row justify-between items-center"
      >
        <Text className="text-gray-800">{selectedLabel}</Text>
        <Text className="text-gray-500">▼</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View className="w-4/5 bg-white rounded-lg max-h-[70%]">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 ${selectedValue === item.value ? "bg-blue-50" : ""}`}
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text
                    className={`${selectedValue === item.value ? "text-blue-600 font-medium" : "text-gray-800"}`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownPicker;
