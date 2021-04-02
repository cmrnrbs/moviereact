import React, { Component } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./../pages/Home";
import Favorite from "./../pages/Favorite";
import Settings from "./../pages/Settings";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as SQLite from "expo-sqlite";
import { ThemeContext } from "../contexts/ThemeContext";
import { IMLocalized } from "../IMLocalized";
const Tab = createBottomTabNavigator();
const db = SQLite.openDatabase("movie.db");
class MainRoot extends Component {
  constructor(props) {
    super(props);

    //TODO: Disable go back [https://reactnavigation.org/docs/preventing-going-back/]
    props.navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      return;
    });

    this.state = {
      isLoading: true,
      genres: [],
    };

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, movie_id INT, title TEXT, genres TEXT, overview TEXT, popularity TEXT, release_date TEXT, vote_average TEXT, vote_count TEXT, poster TEXT, backdrop TEXT);"
      );
    });

    this.fetchData();
  }

  fetchData() {
    return fetch(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=802b2c4b88ea1183e50e6b285a27696e"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //TODO: Localize for Genres
        responseJson.genres.map((genre) => {
          const key = genre.name.toString().toLowerCase().replace(" ", "");
          genre.name = IMLocalized(key);
        });

        this.setState({
          isLoading: false,
          genres: responseJson.genres,
        });
      })
      .catch((error) => console.error(error));
  }

  render() {
    const HomeComponent = (props) => (
      <Home {...props} genres={this.state.genres} />
    );
    if (this.state.isLoading) {
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </SafeAreaView>;
    }
    return (
      <ThemeContext.Consumer>
        {(context) => {
          const { isDarkMode, light, dark } = context;
          return (
            <Tab.Navigator
              tabBarOptions={{
                activeTintColor: isDarkMode ? "#FFF" : "#333",
                inactiveTintColor: "#999",
                keyboardHidesTabBar: true,
                labelStyle: { fontFamily: "poppins-r" },
                style: {
                  backgroundColor: isDarkMode ? dark.bg : light.bg,
                  borderTopWidth: 0,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                },
              }}
              initialRouteName="Home"
            >
              <Tab.Screen
                options={{
                  tabBarLabel: IMLocalized("home"),
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="home"
                      color={color}
                      size={22}
                    />
                  ),
                }}
                name={IMLocalized("home")}
                component={HomeComponent}
              />
              <Tab.Screen
                options={{
                  tabBarLabel: IMLocalized("favorites"),
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="heart"
                      color={color}
                      size={22}
                    />
                  ),
                }}
                name={IMLocalized("favorites")}
                component={Favorite}
              />
              <Tab.Screen
                options={{
                  tabBarLabel: IMLocalized("settings"),
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="cog"
                      color={color}
                      size={22}
                    />
                  ),
                }}
                name={IMLocalized("settings")}
                component={Settings}
              />
            </Tab.Navigator>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});

export default MainRoot;
