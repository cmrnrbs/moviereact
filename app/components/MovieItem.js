import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TextPropTypes,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

function MovieItem(props) {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("MovieDetail", { item: props.item });
      }}
    >
      <View style={styles.item}>
        <Image
          style={styles.poster}
          source={{
            uri: props.item.poster_path,
          }}
        />
        <Text style={{ width: 171, fontFamily: "poppins-r", fontSize: 13 }}>
          {props.item.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginRight: 10,
  },
  poster: {
    width: 171,
    height: 255.5,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default MovieItem;
