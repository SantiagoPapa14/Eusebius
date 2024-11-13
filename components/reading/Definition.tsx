import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Feather";
import { showMessage } from "react-native-flash-message";
import { useAuth } from "../../context/AuthContext";

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
  const { authState } = useAuth();
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
            {/* Definition */}
            <Text className="text-3xl font-bold">
              {definitionData.short_name}
            </Text>
            <Text className="text-lg">{definitionData.full_name}</Text>
            <Text className="text-xl mt-10 text-center">
              {definitionData.translation}
            </Text>
            {/* Divider */}
            <View className="w-full h-px bg-gray-300 mt-10" />
            {/* Save word */}
            <Text className="text-xl font-bold mt-5">
              Done studying this word?
            </Text>
            <TouchableOpacity
              onPress={async () => {
                const response = await fetch(
                  `http://10.0.2.2:4000/words/${definitionData.short_name}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${authState?.token}`,
                    },
                    body: JSON.stringify({
                      word: definitionData.short_name,
                      definition: definitionData.translation,
                    }),
                  }
                );
                if (response.ok)
                  showMessage({ message: "Word saved", type: "info" });
                else
                  showMessage({ message: "Already known!", type: "warning" });
                setDefinitionIsOpen(false);
              }}
              className="flex flex-row items-center justify-center space-x-2 w-3/4 h-10 bg-gray-200 rounded-full shadow-lg  mt-10"
            >
              <Icon name={"archive"} size={20} color={"black"} />
              <Text className="text-lg ml-2">Add to your vocabulary</Text>
            </TouchableOpacity>
            {/* Divider */}
            <View className="w-full h-px bg-gray-300 mt-10" />

            {/* Go to definition page */}
            <Text className="text-xl font-bold mt-5">
              Not making much sense?
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://logeion.uchicago.edu/${definitionData.short_name}`
                )
              }
              className="flex flex-row items-center justify-center w-2/3 h-10 bg-gray-200 rounded-full shadow-lg  mt-10"
            >
              <Icon name={"search"} size={20} color={"black"} />
              <Text className="text-lg ml-2">Full definition</Text>
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
