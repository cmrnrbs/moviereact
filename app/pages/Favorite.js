import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import { Text, View, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { ScrollView } from "react-native-gesture-handler";
import AppLoading from "expo-app-loading";
import RecentMovieItem from "../components/RecentMovieItem";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import { ThemeContext } from "../contexts/ThemeContext";
import { IMLocalized } from "../IMLocalized";
const db = SQLite.openDatabase("movie.db");
export default function Favorite({ navigation, route }) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const fetchSqliteData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Favorites",
        null,
        (txObj, { rows: { _array } }) => {
          setData(_array);
          setLoading(false);
        },
        (txObj, error) => console.error(error)
      );
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchSqliteData();
    });
    return unsubscribe;
  }, [navigation]);

  if (data == null && isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppLoading />
      </View>
    );
  } else if (!isLoading) {
    if (data.length == 0) {
      return (
        <ThemeContext.Consumer>
          {(context) => {
            const { isDarkMode, light, dark } = context;
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isDarkMode ? dark.bg : light.bg,
                }}
              >
                <StatusBar style={isDarkMode ? "light" : "dark"} />
                <View style={{ alignItems: "center" }}>
                  <MaterialCommunityIcons
                    name="cloud-off-outline"
                    color={isDarkMode ? light.bg : dark.bg}
                    size={36}
                  />
                  <View style={{ marginBottom: 5 }} />
                  <Text
                    style={[
                      styles.nodata,
                      { color: isDarkMode ? light.bg : dark.bg },
                    ]}
                  >
                    {IMLocalized("nodatafound")}
                  </Text>
                </View>
              </View>
            );
          }}
        </ThemeContext.Consumer>
      );
    } else {
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
                <Text
                  style={[
                    styles.title,
                    { color: isDarkMode ? light.bg : dark.bg },
                  ]}
                >
                  {IMLocalized("favorites")}
                </Text>
                <ScrollView style={{ paddingHorizontal: 20 }}>
                  {data.map((item) => {
                    const movieDir =
                      FileSystem.documentDirectory + "/" + item.movie_id + "/";
                    const posterPath = movieDir + "poster_path.jpg";
                    const backdropPath = movieDir + "backdrop_path.jpg";
                    item.genres =
                      typeof item.genres == "string"
                        ? item.genres.split(",")
                        : item.genres;
                    item.poster_path = posterPath;
                    item.backdrop_path = backdropPath;
                    item.id = item.movie_id;
                    return (
                      <RecentMovieItem
                        key={item.id}
                        item={item}
                        context={context}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            );
          }}
        </ThemeContext.Consumer>
      );
    }
  }

  return <View></View>;
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
    paddingLeft: 20,
    fontSize: 22,
    fontFamily: "poppins-sb",
    marginBottom: 20,
  },
  nodata: {
    fontFamily: "poppins-r",
    fontSize: 16,
  },
});
