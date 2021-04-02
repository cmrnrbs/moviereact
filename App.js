import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainRoot from "./app/pages/MainRoot";
import MovieDetail from "./app/pages/MovieDetail";
import * as Font from "expo-font";
import ThemeContextProvider from "./app/contexts/ThemeContext";
import ViewAll from "./app/pages/ViewAll";
import AppIntro from "./app/pages/AppIntro";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Stack = createStackNavigator();
import { IMLocalized, init } from "./app/IMLocalized";
export default function App() {
  const [fontsLoaded, setFontLoaded] = React.useState(false);
  const [initialPage, setInitialPage] = React.useState("MainRoot");

  const getPage = async () => {
    try {
      const value = await AsyncStorage.getItem("isFirstRun");
      if (value == "true" || value == null) {
        setInitialPage("AppIntro");
      }
    } catch (e) {
      console.error(e);
    }
  };

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
    //AsyncStorage.clear();
    //setInitialPage("AppIntro");
    //loadResourcesAndDataAsync();
    getPage().then(() => loadResourcesAndDataAsync());
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  init();
  return (
    <ThemeContextProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialPage}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="MainRoot"
            component={MainRoot}
            options={{
              title: "MainRoot",
            }}
          />
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetail}
            options={{ title: "MovieDetail" }}
          />
          <Stack.Screen
            name="ViewAll"
            component={ViewAll}
            options={{ title: "ViewAll" }}
          />

          <Stack.Screen
            name="AppIntro"
            component={AppIntro}
            options={{ title: "AppIntro" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContextProvider>
  );
}
