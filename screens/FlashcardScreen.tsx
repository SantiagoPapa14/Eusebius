import React, { useEffect, useState, useRef } from "react";
import {
  ImageBackground,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import Flashcard from "../components/flashcard/Flashcard";
import { useAuth } from "../context/AuthContext";
import { Word } from "../constants/EusebiusTypes";
import Icon from "react-native-vector-icons/Feather";

// A carousel that works on web (mouse + touch) and native (touch)
const SwipeCarousel = ({ data }: { data: Word[] }) => {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef(0);
  const containerRef = useRef<any>(null);

  const SWIPE_THRESHOLD = 60;
  const { width } = Dimensions.get("window");
  const cardWidth = Math.min(width * 0.75, 380);
  const cardHeight = Math.min(Dimensions.get("window").height * 0.5, 420);

  const goNext = () => setIndex((i) => (i + 1) % data.length);
  const goPrev = () => setIndex((i) => (i - 1 + data.length) % data.length);

  const handleDragEnd = (deltaX: number) => {
    if (deltaX < -SWIPE_THRESHOLD) goNext();
    else if (deltaX > SWIPE_THRESHOLD) goPrev();
    setDragging(false);
    setDragOffset(0);
  };

  // Web mouse events
  const onMouseDown = (e: any) => {
    startX.current = e.clientX;
    setDragging(true);
  };
  const onMouseMove = (e: any) => {
    if (!dragging) return;
    setDragOffset(e.clientX - startX.current);
  };
  const onMouseUp = (e: any) => {
    if (!dragging) return;
    handleDragEnd(e.clientX - startX.current);
  };

  // Touch events (works on both web mobile and native via onStartShouldSetResponder)
  const onTouchStart = (e: any) => {
    const clientX =
      e.nativeEvent?.touches?.[0]?.pageX ?? e.touches?.[0]?.clientX;
    startX.current = clientX;
    setDragging(true);
  };
  const onTouchMove = (e: any) => {
    if (!dragging) return;
    const clientX =
      e.nativeEvent?.touches?.[0]?.pageX ?? e.touches?.[0]?.clientX;
    setDragOffset(clientX - startX.current);
  };
  const onTouchEnd = (e: any) => {
    if (!dragging) return;
    const clientX =
      e.nativeEvent?.changedTouches?.[0]?.pageX ??
      e.changedTouches?.[0]?.clientX;
    handleDragEnd(clientX - startX.current);
  };

  const prev = (index - 1 + data.length) % data.length;
  const next = (index + 1) % data.length;

  // On web we attach mouse events via style prop ref
  const webEvents =
    Platform.OS === "web"
      ? {
          onMouseDown,
          onMouseMove,
          onMouseUp,
          onMouseLeave: () => {
            if (dragging) handleDragEnd(dragOffset);
          },
        }
      : {};

  return (
    <View style={[carouselStyles.root, { height: cardHeight + 180 }]}>
      {/* Cards track */}
      <View
        style={carouselStyles.track}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={onTouchStart}
        onResponderMove={onTouchMove}
        onResponderRelease={onTouchEnd}
        // @ts-ignore — web-only props
        {...webEvents}
      >
        {/* Previous card (peek) */}
        <View
          style={[
            carouselStyles.sideCard,
            {
              width: cardWidth,
              height: cardHeight,
              left: -(cardWidth * 0.55) + (dragging ? dragOffset * 0.3 : 0),
              opacity: 0.35,
            },
          ]}
          pointerEvents="none"
        >
          <Flashcard front={data[prev].text} back={data[prev].translation} />
        </View>

        {/* Main card */}
        <View
          style={[
            carouselStyles.mainCard,
            {
              width: cardWidth,
              height: cardHeight,
              transform: [{ translateX: dragging ? dragOffset : 0 }],
            },
          ]}
        >
          <Flashcard front={data[index].text} back={data[index].translation} />
        </View>

        {/* Next card (peek) */}
        <View
          style={[
            carouselStyles.sideCard,
            {
              width: cardWidth,
              height: cardHeight,
              right: -(cardWidth * 0.55) + (dragging ? -dragOffset * 0.3 : 0),
              opacity: 0.35,
            },
          ]}
          pointerEvents="none"
        >
          <Flashcard front={data[next].text} back={data[next].translation} />
        </View>
      </View>

      {/* Navigation row */}
      <View style={carouselStyles.navRow}>
        <TouchableOpacity onPress={goPrev} style={carouselStyles.navButton}>
          <Icon name="chevron-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={carouselStyles.counter}>
          {index + 1} / {data.length}
        </Text>
        <TouchableOpacity onPress={goNext} style={carouselStyles.navButton}>
          <Icon name="chevron-right" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <Text style={carouselStyles.hint}>
        Click para dar vuelta · Desliza o flechas para cambiar
      </Text>
    </View>
  );
};

const carouselStyles = StyleSheet.create({
  root: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden" as any,
    // @ts-ignore
    cursor: "grab",
    userSelect: "none",
  },
  mainCard: {
    position: "absolute",
    zIndex: 10,
  },
  sideCard: {
    position: "absolute",
    zIndex: 5,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 24,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  counter: {
    fontSize: 16,
    color: "#6b7280",
    minWidth: 60,
    textAlign: "center",
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: "#9ca3af",
  },
});

// ─── Main Screen ────────────────────────────────────────────────────────────

const FlashcardScreen = () => {
  const { secureFetch } = useAuth();
  if (!secureFetch) return null;

  const [data, setData] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await secureFetch(`/word/all`);
        setData(result.sort(() => Math.random() - 0.5));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  if (data.length === 0) {
    return (
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
          <Text style={styles.emptyMessageText}>
            Puedes clickear cualquier palabra dentro de las lecturas para ver su
            significado, luego puedes agregarla a tu vocabulario y repasarla
            aquí!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/MichaelWpp.jpg")}
        style={[styles.background, { opacity: 0.15 }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <SwipeCarousel data={data} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#ef4444" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessageText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 18,
    margin: 20,
  },
});

export default FlashcardScreen;
