import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Modal,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Constants from "expo-constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";
import ChipGroup from "./../components/ChipGroup";
import TeaserTrailer from "./../models/TeaserTrailer";
import TrailerItem from "../components/TrailerItem";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { IMLocalized } from "../IMLocalized";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeContext } from "../contexts/ThemeContext";
import Cast from "./../models/Cast";
import CastItem from "../components/CastItem";
import * as Notifications from "expo-notifications";
import Moment from "moment";
const db = SQLite.openDatabase("movie.db");
import AsyncStorage from "@react-native-async-storage/async-storage";
import SnackBar from "react-native-snackbar-component";
import moment from "moment";
class MovieDetail extends Component {
  movieItem = null;
  baseUrl = "http://api.themoviedb.org/3/movie/";
  apiKey = "802b2c4b88ea1183e50e6b285a27696e";
  scrollHeight = 0;
  triggerValue = "15";

  getTriggerValue = async () => {
    try {
      const value = await AsyncStorage.getItem("triggerValue");
      if (value == null) {
        await AsyncStorage.setItem("triggerValue", "15");
      } else {
        this.triggerValue = value;
      }
    } catch (e) {
      console.error(e);
    }
  };

  constructor(props) {
    super(props);
    this.movieItem = props.route.params.item;
    this.readMovieData(this.movieItem);
    var topSpace = Constants.statusBarHeight + 10;
    this.scrollHeight =
      Dimensions.get("screen").height -
      (Platform.OS == "ios" ? 0 : topSpace) -
      70;
    this.getTriggerValue();
  }

  state = {
    teaserTrailers: [],
    activeMovieTrailerKey: "",
    modalVisible: false,
    isFavorite: false,
    castResults: [],
    isShow: true,
    isVisibleMessage: false,
    messageText: "",
  };

  checkDate = () => {
    var d = Moment(this.movieItem.release_date);
    var current = Date.now();

    var now = moment(current);

    var duration = moment.duration(d.diff(now));
    var days = duration.asDays();

    if (days <= 0) {
      this.setState({ isShow: false });
    }
  };

  readMovieData(data) {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Favorites WHERE movie_id = ?",
        [data.id],
        (txObj, { rows: { _array } }) => {
          if (_array.length != 0) {
            this.setState({ isFavorite: true });
          } else {
            // console.log("data yok");
          }
        },
        (txObj, error) => console.error(error)
      );
    });
  }

  setFavoriteAlarm = async () => {
    var addForDay =
      this.triggerValue != "15" && this.triggerValue != "30"
        ? Number.parseInt(this.triggerValue)
        : 0;

    var addForMin =
      this.triggerValue != "1" && this.triggerValue != "2"
        ? Number.parseInt(this.triggerValue)
        : 0;

    var year = this.movieItem.release_date.split("-")[0];
    var month = this.movieItem.release_date.split("-")[1];
    var days =
      Number.parseInt(this.movieItem.release_date.split("-")[2]) + addForDay;
    var hours = new Date().getHours();
    var min = new Date().getMinutes() + addForMin;
    var sec = new Date().getSeconds();
    var releaseDate = year + "-" + month + "-" + days;
    var movieDay = Date.parse(releaseDate);
    const movieTrigger = new Date(movieDay);
    movieTrigger.setMinutes(min);
    movieTrigger.setHours(hours);
    movieTrigger.setSeconds(sec);
    movieTrigger.setMilliseconds(0);
    //console.log(movieTrigger);
    var dayString =
      this.triggerValue == 15 || this.triggerValue == 30
        ? IMLocalized("today")
        : IMLocalized("tomorrow");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Movie Catch",
        body:
          dayString +
          ", " +
          this.movieItem.title +
          " " +
          IMLocalized("notbody"),
        data: this.movieItem,
      },
      trigger: movieTrigger,
      identifier: this.movieItem.id.toString(),
    });
  };

  cancelFavoriteAlarm = async () => {
    await Notifications.cancelScheduledNotificationAsync(
      this.movieItem.id.toString()
    );
  };

  downloadFile = async (data, process) => {
    const movieDir = FileSystem.documentDirectory + "/" + data.id + "/";
    const dirInfo = await FileSystem.getInfoAsync(movieDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(movieDir, { intermediates: true });
    }
    const fileUri =
      movieDir + (process == 1 ? "poster_path.jpg" : "backdrop_path.jpg");

    const uri = process == 1 ? data.poster_path : data.backdrop_path;
    let downloadObject = FileSystem.createDownloadResumable(uri, fileUri);
    let response = await downloadObject.downloadAsync();
    return response;
  };

  deleteItem = async (data) => {
    const movieDir = FileSystem.documentDirectory + "/" + data.id + "/";
    await FileSystem.deleteAsync(movieDir);
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM Favorites WHERE movie_id = ? ",
        [data.id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            //Delete operation
            this.setState({ isFavorite: false });
            this.setMessage(2);
            this.cancelFavoriteAlarm();
          }
        }
      );
    });
  };

  addItem = async (data) => {
    await this.downloadFile(data, 1).then((response) => {
      //TODO: poster_path download
      if (response.status == 200) {
        this.downloadFile(data, 2).then((response) => {
          //TODO: backdrop_path download
          if (response.status == 200) {
            if (data.genresString == undefined) {
              data.genresString = "";
              data.genresString += data.genres.map((item, index) => item);
            }
            db.transaction((tx) => {
              tx.executeSql(
                "INSERT INTO Favorites (movie_id, title, genres, overview, popularity, release_date, vote_average, vote_count) values (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  data.id,
                  data.title,
                  data.genresString,
                  data.overview,
                  data.popularity,
                  data.release_date,
                  data.vote_average,
                  data.vote_count,
                ],
                (txObj, resultSet) => {
                  this.setState({ isFavorite: true });
                  this.setMessage(1);
                  this.setFavoriteAlarm();
                },
                (txObj, error) => console.log("Error", error)
              );
            });
          }
        });
      }
    });
  };

  setMessage = async (process) => {
    //TODO: process  1 = ekleme , 2 = çıkarma
    if (process == 1) {
      this.setState({ messageText: IMLocalized("movieadd") });
    } else {
      this.setState({ messageText: IMLocalized("movieremove") });
    }

    this.setState({ isVisibleMessage: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.setState({ isVisibleMessage: false });
  };

  favoriteProcess(data) {
    if (this.state.isFavorite) {
      //TODO: delete
      this.deleteItem(data);
    } else {
      //TODO: insert
      this.addItem(data);
    }
  }

  componentDidMount() {
    this.checkDate();
    return fetch(
      this.baseUrl + this.movieItem.id + "/videos?api_key=" + this.apiKey
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

        fetch(
          this.baseUrl + this.movieItem.id + "/credits?api_key=" + this.apiKey
        )
          .then((response) => response.json())
          .then((responseJson) => {
            var casts = [];
            responseJson.cast.map((cast) => {
              casts.push(
                new Cast({
                  id: cast.id,
                  name: cast.name,
                  profile_path: cast.profile_path,
                  character: cast.character,
                })
              );
            });
            this.setState({ castResults: casts });
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {(context) => {
          const { isDarkMode, light, dark } = context;
          return (
            <View style={styles.container}>
              <StatusBar style={isDarkMode ? "light" : "dark"} />
              <SnackBar
                visible={this.state.isVisibleMessage}
                textMessage={this.state.messageText}
                backgroundColor={isDarkMode ? light.bg : dark.bg}
                messageColor={isDarkMode ? dark.bg : light.bg}
              />
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
              <Image
                style={styles.poster}
                resizeMode={"cover"}
                source={{
                  uri: this.movieItem.backdrop_path,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <LinearGradient
                  colors={[
                    "#ffffff03",
                    isDarkMode ? dark.bg : light.bg,
                    isDarkMode ? "#000" : light.bg,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: Platform.OS == "ios" ? 0.6 : 0.7 }}
                  style={{ height: "100%" }}
                ></LinearGradient>
              </View>

              <View
                style={{
                  position: "absolute",
                  top: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.props.navigation.pop();
                  }}
                >
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
                    color={isDarkMode ? light.bg : dark.bg}
                  />
                </TouchableWithoutFeedback>
                {this.state.isShow ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.favoriteProcess(this.movieItem)}
                  >
                    <MaterialCommunityIcons
                      style={{
                        position: "absolute",
                        top: Constants.statusBarHeight + 10,
                        right: 10,
                        zIndex: 1,
                        paddingLeft: 20,
                        paddingBottom: 20,
                      }}
                      name={this.state.isFavorite ? "heart" : "heart-outline"}
                      size={24}
                      color={isDarkMode ? light.bg : dark.bg}
                    />
                  </TouchableWithoutFeedback>
                ) : (
                  <View />
                )}
                <View
                  style={{
                    marginTop: 70,
                    height: this.scrollHeight,
                  }}
                >
                  <ScrollView>
                    <View style={styles.posterSpace} />
                    <View
                      style={{
                        flex: 1,
                        padding: 20,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <View
                          style={{ flexWrap: "wrap", flexDirection: "column" }}
                        >
                          <Text
                            style={[
                              styles.title,
                              { color: isDarkMode ? light.bg : dark.bg },
                            ]}
                          >
                            {this.movieItem.title}
                          </Text>
                          <Text
                            style={[
                              styles.subtitle,
                              { color: isDarkMode ? light.bg : dark.bg },
                            ]}
                          >
                            {this.movieItem.release_date}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.ratingBadge,
                            {
                              backgroundColor: isDarkMode ? light.bg : dark.bg,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.rating,
                              { color: isDarkMode ? dark.bg : light.bg },
                            ]}
                          >
                            {this.movieItem.vote_average}
                          </Text>
                        </View>
                      </View>

                      <ChipGroup
                        datas={this.movieItem.genres}
                        context={context}
                      />
                      <Text
                        style={[
                          styles.header,
                          { color: isDarkMode ? light.bg : dark.bg },
                        ]}
                      >
                        {IMLocalized("overview")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "poppins-l",
                          fontSize: 15,
                          textAlign: "justify",
                          color: isDarkMode ? light.bg : dark.bg,
                        }}
                      >
                        {this.movieItem.overview}
                      </Text>
                      <Text
                        style={[
                          styles.header,
                          { color: isDarkMode ? light.bg : dark.bg },
                        ]}
                      >
                        {IMLocalized("teaserstrailers")}
                      </Text>
                      <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                        {this.state.teaserTrailers.map((item, index) => {
                          return (
                            <TrailerItem
                              poster={this.movieItem.backdrop_path}
                              key={item.key}
                              context={context}
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
                      <View
                        style={{
                          justifyContent: "space-between",
                          flexDirection: "row",
                          flex: 1,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            styles.header,
                            { color: isDarkMode ? light.bg : dark.bg },
                          ]}
                        >
                          {IMLocalized("casts")}
                        </Text>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.props.navigation.navigate("CastViewAll", {
                              movieid: this.movieItem.id,
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
                              {IMLocalized("viewall")}
                            </Text>
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={20}
                              color={isDarkMode ? light.bg : dark.bg}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                      <ScrollView>
                        {this.state.castResults.map((cast, index) => {
                          return index < 4 ? (
                            <CastItem
                              cast={cast}
                              context={context}
                              key={cast.id}
                            />
                          ) : (
                            <View key={cast.id} />
                          );
                        })}
                      </ScrollView>
                    </View>
                  </ScrollView>
                </View>
              </View>
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
    backgroundColor: "white",
  },
  rating: {
    fontFamily: "poppins-sb",
    marginTop: 4,
  },
  ratingBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "poppins-l",
  },
  poster: {
    height: 281,
  },
  posterSpace: {
    height: 210,
  },
  title: {
    fontSize: 17,
    fontFamily: "poppins-r",
  },
  header: {
    fontSize: 20,
    fontFamily: "poppins-sb",
    marginTop: 10,
  },
});

export default MovieDetail;
