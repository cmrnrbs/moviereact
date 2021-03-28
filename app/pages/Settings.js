import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Switch,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import { ThemeContext } from "../contexts/ThemeContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
export default class Settings extends Component {
  showLicenses = () =>
    Alert.alert(
      "Privacy Policy",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Ok",
          style: "ok",
        },
      ],
      {
        cancelable: true,
      }
    );

  render() {
    return (
      <ThemeContext.Consumer>
        {(context) => {
          const { isDarkMode, light, dark, updateTheme } = context;
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
                Settings
              </Text>
              <View style={styles.settingsItem}>
                <View style={styles.settingsItem2}>
                  <MaterialCommunityIcons
                    name={isDarkMode ? "weather-night" : "weather-sunny"}
                    size={26}
                    color={isDarkMode ? light.bg : dark.bg}
                  />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: "poppins-l",
                      fontSize: 15,
                      color: isDarkMode ? light.bg : dark.bg,
                    }}
                  >
                    Dark Mode
                  </Text>
                </View>
                <Switch value={isDarkMode} onValueChange={updateTheme} />
              </View>
              <TouchableWithoutFeedback
                style={styles.listitem}
                onPress={this.showLicenses}
              >
                <View style={[styles.settingsItem2, { paddingHorizontal: 20 }]}>
                  <MaterialCommunityIcons
                    name="book-open-outline"
                    size={26}
                    color={isDarkMode ? light.bg : dark.bg}
                  />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: "poppins-l",
                      fontSize: 15,
                      color: isDarkMode ? light.bg : dark.bg,
                    }}
                  >
                    Privacy Policy
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View style={[styles.settingsItem2, { paddingHorizontal: 20 }]}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={26}
                  color={isDarkMode ? light.bg : dark.bg}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: "poppins-l",
                      fontSize: 15,
                      color: isDarkMode ? light.bg : dark.bg,
                    }}
                  >
                    Version
                  </Text>
                  <Text
                    style={{
                      fontFamily: "poppins-l",
                      fontSize: 15,
                      color: isDarkMode ? light.bg : dark.bg,
                    }}
                  >
                    v{Constants.manifest.version}
                  </Text>
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
    paddingTop: Constants.statusBarHeight,
  },
  listitem: {
    marginVertical: 10,
  },
  settingsItem: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  settingsItem2: {
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row",
  },
  example: {
    width: 150,
    height: 150,
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
});
