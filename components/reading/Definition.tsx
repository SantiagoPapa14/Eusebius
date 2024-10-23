import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface Props {
  definitionData: any;
  definitionIsOpen: boolean;
  setDefinitionIsOpen: any;
  selfRef: any;
}

const Definition: React.FC<Props> = ({
  definitionData,
  definitionIsOpen,
  setDefinitionIsOpen,
  selfRef,
}) => {
  if (!definitionIsOpen) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={selfRef}
        onChange={(index) => setDefinitionIsOpen(index !== -1)}
        snapPoints={["85%"]}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.contentContainer}>
          <View className="flex-1 flex items-center">
            <Text className="text-3xl font-bold">
              {definitionData.short_name}
            </Text>
            <Text className="text-lg">{definitionData.full_name}</Text>
            <Text className="text-lg italic">{`(${definitionData.type.label})`}</Text>
            <Text className="text-xl mt-10 text-center">
              {definitionData.translations_unstructured.en}
            </Text>
            <TouchableOpacity
              className="mt-10"
              onPress={() => Linking.openURL(definitionData.url)}
            >
              <Text className="text-lg text-center text-blue-500 italic">
                Press here for a more in-depth definition!
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0", // Adjust background color as needed
  },
  absoluteContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Definition;
