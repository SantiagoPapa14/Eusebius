import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useAuth } from "../context/AuthContext";
import { Word } from "../constants/EusebiusTypes";
import { showMessage } from "react-native-flash-message";

// On web, we render the modal as a plain fixed-position div to avoid
// the viewport-resize issue triggered by RN's Modal + virtual keyboard.
const WebModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ visible, onClose, children }) => {
  if (!visible) return null;
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        // This is the key: fixed positioning is unaffected by the virtual keyboard
      }}
    >
      {children}
    </div>
  );
};

const VocabularyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { secureFetch } = useAuth();
  if (!secureFetch) return null;

  const [data, setData] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalWord, setModalWord] = useState("");
  const [modalDefinition, setModalDefinition] = useState("");
  const [selectedWordId, setSelectedWordId] = useState(-1);

  // Lock the body so the keyboard never shifts the page layout
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const originalHeight = `${window.innerHeight}px`;
      document.documentElement.style.setProperty(
        "--app-height",
        originalHeight,
      );
      document.body.style.position = "fixed";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
      document.body.style.height = originalHeight;
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = originalHeight;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await secureFetch(`/word/all`);
        setData(result as Word[]);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedWordId(-1);
    setModalWord("");
    setModalDefinition("");
  };

  const openEditModal = (item: Word) => {
    setModalWord(item.text);
    setModalDefinition(item.translation);
    setSelectedWordId(item.id);
    setModalVisible(true);
  };

  const openNewModal = () => {
    setModalWord("");
    setModalDefinition("");
    setSelectedWordId(-1);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Word }) => (
    <View style={styles.itemRow}>
      <TouchableOpacity
        onPress={() => openEditModal(item)}
        style={[styles.itemButton, { height: "100%" }]}
      >
        <Text style={styles.itemText}>
          {item.text.charAt(0).toUpperCase() + item.text.slice(1)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => openEditModal(item)}
        style={[styles.itemButton, { height: "100%" }]}
      >
        <Text style={styles.itemText}>{item.translation}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleWordDelete(item)}
      >
        <Icon name="trash-2" size={18} color="red" />
      </TouchableOpacity>
    </View>
  );

  const handleWordSave = async () => {
    const method = selectedWordId === -1 ? "POST" : "PUT";
    const res = await secureFetch(`/word`, {
      method,
      body: JSON.stringify({
        id: selectedWordId === -1 ? undefined : selectedWordId,
        text: modalWord,
        translation: modalDefinition,
      }),
    });

    if (method === "POST") {
      setData([
        ...data,
        { id: res.id, text: res.text, translation: res.translation },
      ]);
      showMessage({ message: "Palabra guardada", type: "info" });
    } else {
      setData(
        data.map((w) =>
          w.id === selectedWordId
            ? { ...w, text: modalWord, translation: modalDefinition }
            : w,
        ),
      );
      showMessage({ message: "Palabra actualizada", type: "info" });
    }
    closeModal();
  };

  const handleWordDelete = async (word: Word) => {
    await secureFetch(`/word`, {
      method: "DELETE",
      body: JSON.stringify(word),
    });
    setData(data.filter((w) => w.id !== word.id));
    showMessage({ message: "Palabra eliminada", type: "danger" });
    closeModal();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{`Error: ${error}`}</Text>
      </View>
    );
  }

  // Modal content shared between web and native
  const modalContent = (
    <View style={styles.modalContent}>
      <Text style={styles.modalLabel}>Palabra:</Text>
      <TextInput
        placeholder="Palabra"
        value={modalWord}
        onChangeText={setModalWord}
        style={styles.modalInput}
      />
      <Text style={styles.modalLabel}>Significado:</Text>
      <TextInput
        placeholder="Significado"
        value={modalDefinition}
        onChangeText={setModalDefinition}
        style={styles.modalInput}
        multiline
        numberOfLines={3}
      />
      <View style={styles.modalButtonRow}>
        <TouchableOpacity
          style={styles.modalSaveButton}
          onPress={handleWordSave}
        >
          <Text style={styles.modalButtonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
          <Text style={styles.modalButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/MichaelWpp.jpg")}
          style={[
            styles.background,
            { opacity: 0.05, width: "100%", height: "100%" },
          ]}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Palabra</Text>
              <Text style={styles.headerText}>Significado</Text>
            </View>

            {data.length === 0 && (
              <Text style={styles.emptyMessage}>
                Puedes clickear cualquier palabra dentro de las lecturas para
                ver su significado, luego puedes agregarla a tu vocabulario y se
                guardará aquí!
              </Text>
            )}

            <FlatList
              style={styles.list}
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </View>
      </View>

      {/* FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity onPress={openNewModal} style={styles.fab}>
          <Icon name="plus" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Modal — use native div on web to avoid keyboard-resize bug */}
      {Platform.OS === "web" ? (
        <WebModal visible={modalVisible} onClose={closeModal}>
          {modalContent}
        </WebModal>
      ) : (
        // Native fallback (iOS/Android)
        modalVisible && (
          <View style={styles.nativeModalOverlay}>{modalContent}</View>
        )
      )}
    </>
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
  },
  content: {
    padding: 16,
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ef4444",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    marginRight: 48,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 18,
    marginTop: 20,
    marginHorizontal: 20,
  },
  list: {
    marginTop: 20,
  },
  itemRow: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
    alignItems: "center",
  },
  itemButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderColor: "#e5e7eb",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    textAlign: "center",
    fontSize: 18,
    paddingHorizontal: 4,
  },
  deleteButton: {
    width: 40,
    height: 40,
    margin: 4,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: 48,
    right: 32,
  },
  fab: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    opacity: 0.8,
    borderRadius: 32,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderColor: "#e5e7eb",
  },
  // Native-only modal overlay (fallback)
  nativeModalOverlay: {
    position: "absolute",
    inset: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    width: "80%",
    maxWidth: 480,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 24,
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#9ca3af",
    borderRadius: 8,
    width: "40%",
  },
  modalCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#6b7280",
    borderRadius: 8,
    width: "40%",
  },
  modalButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default VocabularyScreen;
