import React, { Component } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Movie from "../models/Movie";
import MovieItem from "../components/MovieItem";
import RecentMovieItem from "../components/RecentMovieItem";
RecentMovieItem;
import Constants from "expo-constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemeContext } from "../contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
export default class Home extends Component {
  deviceWidth = Dimensions.get("window").width;
  _isMount = false;
  baseUrl = "http://api.themoviedb.org/3/movie/";
  apiKey = "802b2c4b88ea1183e50e6b285a27696e";
  genres = [];
  state = {
    isLaoding: false,
    recentMovies: [],
    popularMovies: [],
    recentMovies: [],
    iconName: "magnify",
    isAnimating: false,
    fadeAnim: new Animated.Value(40),
  };

  constructor(props) {
    super(props);
    this.genres = props.genres;
  }

  componentDidMount() {
    this._isMount = true;

    return fetch(this.baseUrl + "popular?api_key=" + this.apiKey)
      .then((response) => response.json())
      .then((responseJson) => {
        const data = [];
        var allgenres = this.genres;
        responseJson.results.forEach((movie) => {
          movie.genres = [];
          movie.genre_ids.forEach((genreid) => {
            var genreData = allgenres.filter((x) => x.id == genreid);
            if (genreData.length != 0) {
              //console.log(genreData[0].name);
              movie.genres.push(genreData[0].name);
            }
          });

          data.push(
            new Movie({
              id: movie.id,
              title: movie.title,
              poster_path:
                "http://image.tmdb.org/t/p/w342/" + movie.poster_path,
              backdrop_path:
                "http://image.tmdb.org/t/p/w500/" + movie.backdrop_path,
              genre_ids: movie.genre_ids,
              overview: movie.overview,
              popularity: movie.popularity,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
              vote_count: movie.vote_count,
              genres: movie.genres,
            })
          );
        });

        if (this._isMount) {
          this.setState({
            popularMovies: data,
          });
        }

        fetch(this.baseUrl + "now_playing?api_key=" + this.apiKey)
          .then((response) => response.json())
          .then((responseJson) => {
            const data = [];
            var allgenres = this.genres;
            responseJson.results.forEach((movie) => {
              movie.genres = [];
              movie.genre_ids.forEach((genreid) => {
                var genreData = allgenres.filter((x) => x.id == genreid);
                if (genreData.length != 0) {
                  //console.log(genreData[0].name);
                  movie.genres.push(genreData[0].name);
                }
              });
              data.push(
                new Movie({
                  id: movie.id,
                  title: movie.title,
                  poster_path:
                    "http://image.tmdb.org/t/p/w342/" + movie.poster_path,
                  backdrop_path:
                    "http://image.tmdb.org/t/p/w500/" + movie.backdrop_path,
                  genre_ids: movie.genre_ids,
                  overview: movie.overview,
                  popularity: movie.popularity,
                  release_date: movie.release_date,
                  vote_average: movie.vote_average,
                  vote_count: movie.vote_count,
                  genres: movie.genres,
                })
              );
            });

            if (this._isMount) {
              this.setState({
                recentMovies: data,
              });
            }
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  handleSelect = () => {
    this.setState({ isAnimating: true });

    this.state.fadeAnim._value != this.deviceWidth - 40
      ? Animated.timing(this.state.fadeAnim, {
          toValue: this.deviceWidth - 40,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          this.setState({ iconName: "close" });
          this.setState({ isAnimating: false });
        })
      : Animated.timing(this.state.fadeAnim, {
          toValue: 40,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          this.setState({ iconName: "magnify" });
          this.setState({ isAnimating: false });
        });
  };

  renderRectangle = (context) => {
    const { isDarkMode, light, dark } = context;
    const customStyle = {
      width: this.state.fadeAnim,
    };

    return (
      <Animated.View style={[styles.rectangle, customStyle]}>
        <TouchableWithoutFeedback
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => this.handleSelect()}
        >
          <MaterialCommunityIcons
            name={this.state.iconName}
            color={isDarkMode ? light.bg : dark.bg}
            size={24}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {(context) => {
          const { isDarkMode, light, dark } = context;

          return (
            <View
              style={[
                styles.container,
                { backgroundColor: isDarkMode ? dark.bg : light.bg },
              ]}
            >
              <StatusBar style={isDarkMode ? "light" : "dark"} />
              <View style={styles.header}>
                {!this.state.isAnimating && this.state.iconName == "magnify" ? (
                  <Text
                    style={[
                      styles.title,
                      { color: isDarkMode ? light.bg : dark.bg },
                    ]}
                  >
                    Movie Catch
                  </Text>
                ) : (
                  <View />
                )}
                <View style={{ flexWrap: "wrap" }}>
                  {this.renderRectangle(context)}
                </View>
              </View>

              <ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    marginVertical: 15,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "poppins-r",
                      color: isDarkMode ? light.bg : dark.bg,
                    }}
                  >
                    Popular Movies
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate("ViewAll", {
                        genres: this.genres,
                        isPopular: true,
                      })
                    }
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "poppins-sb",
                          color: isDarkMode ? light.bg : dark.bg,
                        }}
                      >
                        View All
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color={isDarkMode ? light.bg : dark.bg}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View
                    style={{ flexDirection: "row", flex: 1, paddingLeft: 20 }}
                  >
                    {this.state.popularMovies.map((item, index) => {
                      return index < 4 ? (
                        <MovieItem
                          key={item.id}
                          item={item}
                          context={context}
                        />
                      ) : (
                        <View key={item.id} />
                      );
                    })}
                  </View>
                </ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    marginVertical: 15,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "poppins-r",
                      color: isDarkMode ? light.bg : dark.bg,
                    }}
                  >
                    Recent Movies
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate("ViewAll", {
                        genres: this.genres,
                        isPopular: false,
                      })
                    }
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "poppins-sb",
                          color: isDarkMode ? light.bg : dark.bg,
                        }}
                      >
                        View All
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        color={isDarkMode ? light.bg : dark.bg}
                        size={20}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                  {this.state.recentMovies.map((item, index) => {
                    return index < 4 ? (
                      <RecentMovieItem
                        key={item.id}
                        item={item}
                        context={context}
                      />
                    ) : (
                      <View key={item.id} />
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 10,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "poppins-sb",
  },
  rectangle: {
    backgroundColor: "#2c3e50",
    height: 40,
  },
});
