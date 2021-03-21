import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Modal,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
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
    activeMovieTrailerKey: "",
    modalVisible: false,
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
        <Modal
          style={{ position: "absolute", top: 0 }}
          animationType="slide"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => this.setState({ modalVisible: false })}
            >
              <View
                style={{
                  backgroundColor: "#222",
                  width: 48,
                  height: 48,
                  position: "absolute",
                  top: Constants.statusBarHeight + 10,
                  justifyContent: "center",
                  alignItems: "center",
                  left: 20,
                  borderRadius: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={"white"}
                />
              </View>
            </TouchableWithoutFeedback>

            <View style={{ width: "100%" }}>
              <YoutubePlayer
                play={true}
                height={270}
                videoId={this.state.activeMovieTrailerKey}
              />
            </View>
          </View>
        </Modal>
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
              {this.state.teaserTrailers.map((item, index) => {
                return (
                  <TrailerItem
                    poster={this.movieItem.backdrop_path}
                    key={item.key}
                    onPressFunction={() => {
                      this.setState({
                        modalVisible: true,
                        activeMovieTrailerKey: item.key,
                      });
                    }}
                    data={item}
                    modalVisible={this.state.modalVisible}
                    itemIndex={index}
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
