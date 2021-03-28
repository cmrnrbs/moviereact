import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainRoot from "./app/pages/MainRoot";
import MovieDetail from "./app/pages/MovieDetail";
import * as Font from "expo-font";
import ThemeContextProvider from "./app/contexts/ThemeContext";
const Stack = createStackNavigator();
export default function App() {
  const [fontsLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        //TODO: Load fonts
        await Font.loadAsync({
          "poppins-r": require("./app/assets/fonts/Poppins-Regular.ttf"),
          "poppins-l": require("./app/assets/fonts/Poppins-Light.ttf"),
          "poppins-sb": require("./app/assets/fonts/Poppins-SemiBold.ttf"),
          "poppins-b": require("./app/assets/fonts/Poppins-Bold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontLoaded(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <ThemeContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="MainRoot"
            component={MainRoot}
            options={{ title: "MainRoot" }}
          />
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetail}
            options={{ title: "MovieDetail" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContextProvider>
  );
}
