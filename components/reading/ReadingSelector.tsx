import type { DailyMassScripture } from "../../constants/EusebiusTypes";
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const title: Record<keyof DailyMassScripture, string> = {
  firstReading: "Lectura",
  gospel: "Evangelio",
  psalm: "Salmo",
  secondReading: "2da Lectura",
};

const SelectReading: React.FC<{
  highlighted: boolean;
  reading: keyof DailyMassScripture;
  handleChangeReading: (reading: keyof DailyMassScripture) => void;
}> = ({ highlighted, reading, handleChangeReading }) => {
  return (
    <TouchableOpacity
      className="flex-1 items-center justify-center h-20"
      onPress={() => handleChangeReading(reading)}
    >
      <Text className={highlighted ? "font-bold text-base" : ""}>
        {title[reading as keyof DailyMassScripture]}
      </Text>
    </TouchableOpacity>
  );
};

const ReadingSelector: React.FC<{
  readings: DailyMassScripture;
  selectedReading: string;
  handleChangeReading: (reading: keyof DailyMassScripture) => void;
}> = ({ readings, selectedReading, handleChangeReading }) => {
  return (
    <View className="flex-row justify-center items-center bg-white h-20 w-screen">
      {Object.keys(readings).map((reading) => {
        const readingKey = reading as keyof DailyMassScripture;
        if (readings[readingKey] === null) return null;
        return (
          <SelectReading
            key={readingKey}
            highlighted={readingKey === selectedReading}
            reading={readingKey}
            handleChangeReading={handleChangeReading}
          />
        );
      })}
    </View>
  );
};

export default ReadingSelector;
