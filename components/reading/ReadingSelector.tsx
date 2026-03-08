import type { DailyMassScripture } from "../../constants/EusebiusTypes";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
      style={styles.selectButton}
      onPress={() => handleChangeReading(reading)}
    >
      <Text style={highlighted ? styles.highlightedText : styles.normalText}>
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
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: 80,
    width: "100%",
  },
  selectButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  highlightedText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  normalText: {
    fontSize: 16,
  },
});

export default ReadingSelector;
