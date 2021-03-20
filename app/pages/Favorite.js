import React, { Component } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

export default class Favorite extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Favorite</Text>
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
