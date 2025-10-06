import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import SkeletonLoader from "../SkeletonLoader";

const SkeletonReader = ({
  hideReadingSelector,
}: {
  hideReadingSelector?: any;
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/MichaelWpp.jpg")}
        style={[styles.background, { opacity: 0.1 }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.readerContainer}>
          <View style={styles.latinTextContainer}>
            <Text style={styles.text}>
              <SkeletonLoader />
            </Text>
          </View>
          {/* Verse Navigation */}
          <View style={styles.verseNavigation}>
            <TouchableOpacity style={styles.navButton} disabled>
              <Icon name="arrow-back" size={30} color="gray" />
            </TouchableOpacity>
            <View style={styles.verseTextContainer}>
              <Text style={styles.verseText}>Loading...</Text>
            </View>
            <TouchableOpacity style={styles.navButton} disabled>
              <Icon name="arrow-forward" size={30} color="gray" />
            </TouchableOpacity>
          </View>
          {/* Placeholder for English Content */}
          <View style={styles.englishTextContainer}>
            <Text style={styles.text}>
              <SkeletonLoader />
            </Text>
          </View>
          {hideReadingSelector ? null : (
            <View style={styles.readingSelectorContainer}>
              <TouchableOpacity style={styles.readingButton} disabled>
                <Text>Psalm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.readingButton} disabled>
                <Text style={styles.boldText}>Gospel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.readingButton} disabled>
                <Text>Reading</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
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
    flex: 1,
    justifyContent: "center",
  },
  readerContainer: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  latinTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingRight: 20,
    paddingLeft: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
  verseNavigation: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    backgroundColor: "#ffffff",
    height: 80,
    width: "75%",
  },
  navButton: {
    marginHorizontal: 8,
  },
  verseTextContainer: {
    flex: 1,
  },
  verseText: {
    fontSize: 18,
    textAlign: "center",
  },
  englishTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 40,
    paddingRight: 20,
    paddingLeft: 20,
  },
  readingSelectorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: 80,
    width: "100%",
  },
  readingButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SkeletonReader;
