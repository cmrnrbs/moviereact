import React, { Component } from "react";
import * as FileSystem from "expo-file-system";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
  Button,
} from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("movie.db");
export default class Favorite extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      test: null,
    };
    this.fetchSqliteData();
  }

  fetchSqliteData() {
    db.transaction((tx) => {
      // sending 4 arguments in executeSql
      tx.executeSql(
        "SELECT * FROM Favorites",
        null,
        (txObj, { rows: { _array } }) => {
          this.setState({ data: _array });
          console.log(_array);
        },
        (txObj, error) => console.error(error)
      ); // end executeSQL
    }); // end transaction
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Favorite</Text>

        <Button onPress={this.islem} title="Tıkla"></Button>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
