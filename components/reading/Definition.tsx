import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Feather";
import { showMessage } from "react-native-flash-message";
import { useAuth } from "../../context/AuthContext";

interface DefinitionData {
  short_name: string;
  full_name: string;
  translation: string;
}

interface DefinitionProps {
  definitionData: DefinitionData;
  definitionIsOpen: boolean;
  setDefinitionIsOpen: (isOpen: boolean) => void;
  selfRef: React.RefObject<BottomSheet>;
}

const Definition: React.FC<DefinitionProps> = ({
  definitionData,
  definitionIsOpen,
  setDefinitionIsOpen,
  selfRef,
}) => {
  const { secureFetch } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  if (!definitionIsOpen || !secureFetch || !definitionData) return null;

  const handleSaveWord = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const response = await secureFetch(`/word`, {
        method: "POST",
        body: JSON.stringify({
          Text: definitionData.short_name,
          Translation: definitionData.translation,
        }),
      });

      const messageType = response.errors ? "warning" : "info";
      const messageText = response.errors
        ? response.errors.Text[0]
        : "Palabra guardada";

      showMessage({ message: messageText, type: messageType });
      setDefinitionIsOpen(false);
    } catch (error) {
      showMessage({
        message: "Error al guardar la palabra",
        type: "danger",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenFullDefinition = () => {
    Linking.openURL(`https://es.glosbe.com/la/es/${definitionData.short_name}`);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={selfRef}
        onChange={(index) => setDefinitionIsOpen(index !== -1)}
        snapPoints={["85%"]}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.content}>
            {/* Word Header */}
            <Text style={styles.shortName}>{definitionData.short_name}</Text>
            <Text style={styles.fullName}>
              {definitionData.translation === ""
                ? "Sin traducción"
                : definitionData.full_name.replaceAll(",", ", ")}
            </Text>
            <Text style={styles.translation}>
              {definitionData.translation === ""
                ? "Haz click en 'Ver definición completa'"
                : definitionData.translation}
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Save Word Section */}
            <Text style={styles.sectionTitle}>
              ¿Ya estudiaste el significado?
            </Text>
            <TouchableOpacity
              onPress={handleSaveWord}
              disabled={isSaving}
              style={[styles.button, styles.saveButton]}
              activeOpacity={0.7}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <>
                  <Icon name="archive" size={20} color="black" />
                  <Text style={styles.buttonText}>Agregar a vocabulario</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Full Definition Section */}
            <Text style={styles.sectionTitle}>¿No tiene mucho sentido?</Text>
            <TouchableOpacity
              onPress={handleOpenFullDefinition}
              style={[styles.button, styles.definitionButton]}
              activeOpacity={0.7}
            >
              <Icon name="search" size={20} color="black" />
              <Text style={styles.buttonText}>Ver definición completa</Text>
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
  content: {
    flex: 1,
    alignItems: "center",
  },
  shortName: {
    fontSize: 30,
    fontWeight: "bold",
  },
  fullName: {
    fontSize: 18,
    marginTop: 4,
  },
  translation: {
    fontSize: 20,
    marginTop: 40,
    textAlign: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#d1d5db",
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  saveButton: {
    width: "75%",
  },
  definitionButton: {
    width: "66%",
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 8,
  },
});

export default Definition;
