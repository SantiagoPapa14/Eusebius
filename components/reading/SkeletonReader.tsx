import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import SkeletonLoader from "../SkeletonLoader";

const SkeletonReader = () => {
  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../assets/MichaelWpp.jpg")}
        className="flex-1"
        resizeMode="cover"
        style={{ opacity: 0.1 }}
      />
      <View
        className="flex-1 flex justify-center"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View className="flex-1 h-screen items-center justify-center bg-gbGray">
          <View className="flex-1 items-center justify-center w-screen mt-10 pr-5 pl-5">
            <Text className="text-lg text-center">
              <SkeletonLoader />
            </Text>
          </View>

          {/* Verse Navigation */}
          <View className="flex-row justify-center items-center rounded-full bg-white h-20 w-3/4">
            <TouchableOpacity className="mx-2" disabled>
              <Icon name="arrow-back" size={30} color="gray" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="flex text-lg items-center text-center">
                Loading...
              </Text>
            </View>
            <TouchableOpacity className="mx-2" disabled>
              <Icon name="arrow-forward" size={30} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Placeholder for English Content */}
          <View className="flex-1 items-center justify-center w-screen mb-10 pr-5 pl-5">
            <Text className="text-lg text-center">
              <SkeletonLoader />
            </Text>
          </View>

          {/* Reading Selector */}
          <View className="flex-row justify-center items-center bg-white h-20 w-screen">
            <TouchableOpacity
              className="flex-1 items-center justify-center h-20"
              disabled
            >
              <Text>Psalm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center justify-center h-20"
              disabled
            >
              <Text className="font-bold text-base">Gospel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center justify-center h-20"
              disabled
            >
              <Text>Reading</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SkeletonReader;
