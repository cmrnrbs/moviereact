import React, { Component, createContext } from "react";
export const ThemeContext = createContext();
import AsyncStorage from "@react-native-async-storage/async-storage";
class ThemeContextProvider extends Component {
  getisDarkMode = async () => {
    try {
      const value = await AsyncStorage.getItem("isDarkMode");
      if (value == null) {
        await AsyncStorage.setItem("isDarkMode", "false");
        await AsyncStorage.setItem("isFirstRun", "true");
      } else {
        if (value == "true") {
          this.setState({ isDarkMode: true });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  constructor() {
    super();
    this.state = {
      isDarkMode: false,
      light: { bg: "#FFF" },
      dark: { bg: "#222124" },
    };
    this.getisDarkMode();
  }

  changeTheme = async () => {
    await AsyncStorage.setItem(
      "isDarkMode",
      !this.state.isDarkMode == false ? "false" : "true"
    );
    this.setState({ isDarkMode: !this.state.isDarkMode });
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{ ...this.state, updateTheme: this.changeTheme }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeContextProvider;
