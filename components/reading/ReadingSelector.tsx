import { View, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import type { massReadingsType } from "../../constants/EusebiusTypes";
type MassReadingKeys = keyof massReadingsType;

const title: Record<MassReadingKeys, string> = {
  firstReading: "Reading",
  gospel: "Gospel",
  psalm: "Psalm",
  secondReading: "2nd Reading",
};

const SelectReading: React.FC<{
  highlighted: boolean;
  reading: keyof massReadingsType;
  handleChangeReading: (reading: keyof massReadingsType) => void;
}> = ({ highlighted, reading, handleChangeReading }) => {
  return (
    <TouchableOpacity
      className="flex-1 items-center justify-center h-20"
      onPress={() => handleChangeReading(reading)}
    >
      <Text className={highlighted ? "font-bold text-base" : ""}>
        {title[reading as MassReadingKeys]}
      </Text>
    </TouchableOpacity>
  );
};

const ReadingSelector: React.FC<{
  readings: massReadingsType;
  selectedReading: string;
  handleChangeReading: (reading: keyof massReadingsType) => void;
}> = ({ readings, selectedReading, handleChangeReading }) => {
  return (
    <View className="flex-row justify-center items-center bg-white h-20 w-screen">
      {Object.keys(readings).map((reading) => {
        const readingKey = reading as MassReadingKeys;
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
