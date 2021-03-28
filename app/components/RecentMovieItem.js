import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

function RecentMovieItem(props) {
  const navigation = useNavigation();
  const deviceWidth = Dimensions.get("window").width;
  const _width = deviceWidth - 50 - 171;
  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("MovieDetail", { item: props.item })}
    >
      <View style={styles.item}>
        <Image
          style={styles.poster}
          source={{
            uri: props.item.poster_path,
          }}
        />
        <View style={{ marginLeft: 10, width: _width }}>
          <Text
            style={{
              width: 171,
              fontFamily: "poppins-r",
              fontSize: 13,
              color: props.context.isDarkMode
                ? props.context.light.bg
                : props.context.dark.bg,
            }}
          >
            {props.item.title}
          </Text>
          <Text
            style={{
              fontFamily: "poppins-l",
              fontSize: 12,
              color: props.context.isDarkMode
                ? props.context.light.bg
                : props.context.dark.bg,
            }}
          >
            {props.item.genres.map(
              (genre, index) =>
                genre + (index < props.item.genres.length - 1 ? ", " : "")
            )}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <MaterialCommunityIcons name="star" color={"#FE6D8E"} size={20} />
            <Text
              style={{
                fontFamily: "poppins-sb",
                alignSelf: "center",
                color: props.context.isDarkMode
                  ? props.context.light.bg
                  : props.context.dark.bg,
              }}
            >
              {props.item.vote_average}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "poppins-l",
                alignSelf: "flex-end",
                color: props.context.isDarkMode
                  ? props.context.light.bg
                  : props.context.dark.bg,
              }}
            >
              {" "}
              / 10
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  poster: {
    width: 171,
    height: 255.5,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default RecentMovieItem;
