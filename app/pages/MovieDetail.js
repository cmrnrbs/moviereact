import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Constants from "expo-constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";
import ChipGroup from "./../components/ChipGroup";
function MovieDetail({ navigation, route }) {
  const movieItem = route.params.item;

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => navigation.pop()}>
          <MaterialCommunityIcons
            style={{
              position: "absolute",
              top: Constants.statusBarHeight + 10,
              left: 10,
              zIndex: 1,
              paddingRight: 20,
              paddingBottom: 20,
            }}
            name="chevron-left"
            size={24}
            color={"#fff"}
          />
        </TouchableWithoutFeedback>
        <Image
          style={styles.poster}
          resizeMode={"cover"}
          source={{
            uri: "http://image.tmdb.org/t/p/w500/" + movieItem.backdrop_path,
          }}
        />
        <View style={{ flex: 1, padding: 20 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
              <Text style={styles.title}>{movieItem.title}</Text>
              <Text>{movieItem.release_date}</Text>
            </View>
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: "white",
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{movieItem.vote_average}</Text>
            </View>
          </View>

          <ChipGroup datas={movieItem.genres} />

          <Text style={styles.header}>Overview</Text>
          <Text>{movieItem.overview}</Text>
          <Text style={styles.header}>Teasers & Trailers</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  poster: {
    height: 281,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default MovieDetail;
