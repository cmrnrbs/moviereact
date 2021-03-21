import React, { Component } from "react";
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
import TeaserTrailer from "./../models/TeaserTrailer";
import TrailerItem from "../components/TrailerItem";
class MovieDetail extends Component {
  movieItem = null;
  constructor(props) {
    super(props);
    this.movieItem = props.route.params.item;
  }

  state = {
    teaserTrailers: [],
  };

  componentDidMount() {
    return fetch(
      "http://api.themoviedb.org/3/movie/" +
        this.movieItem.id +
        "/videos?api_key=802b2c4b88ea1183e50e6b285a27696e"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        var items = [];
        responseJson.results.map((movie) => {
          items.push(
            new TeaserTrailer({
              key: movie.key,
              name: movie.name,
              type: movie.type,
            })
          );
        });

        this.setState({ teaserTrailers: items });
      })
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.pop()}>
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
              uri:
                "http://image.tmdb.org/t/p/w500/" +
                this.movieItem.backdrop_path,
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
                <Text style={styles.title}>{this.movieItem.title}</Text>
                <Text>{this.movieItem.release_date}</Text>
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
                <Text>{this.movieItem.vote_average}</Text>
              </View>
            </View>

            <ChipGroup datas={this.movieItem.genres} />

            <Text style={styles.header}>Overview</Text>
            <Text>{this.movieItem.overview}</Text>
            <Text style={styles.header}>Teasers & Trailers</Text>
            <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
              {this.state.teaserTrailers.map((item) => {
                return (
                  <TrailerItem
                    key={item.key}
                    poster={this.movieItem.backdrop_path}
                    data={item}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
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
