import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainRoot from "./app/pages/MainRoot";
import MovieDetail from "./app/pages/MovieDetail";
import * as Font from "expo-font";
import ThemeContextProvider, {
  ThemeContext,
} from "./app/contexts/ThemeContext";
import ViewAll from "./app/pages/ViewAll";
import AppIntro from "./app/pages/AppIntro";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Stack = createStackNavigator();
import { init } from "./app/IMLocalized";
import CastViewAll from "./app/pages/CastViewAll";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import CustomSplashScreen from "./app/components/CustomSplashScreen";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isReady, setReady] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
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

  const onLoadLayout = async () => {
    SplashScreen.hideAsync();
    try {
      const value = await AsyncStorage.getItem("isDarkMode");
      if (value != null) {
        if (value == "true") {
          setDarkMode(true);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setReady(true);
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
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
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response.notification.request.content.data);
        const movieData = response.notification.request.content.data;
      }
    );

    getPage().then(() => loadResourcesAndDataAsync());
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log(token);

    /* if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }*/

    return token;
  }

  if (!fontsLoaded) {
    return null;
  }

  init();
  if (!isReady) {
    return (
      <CustomSplashScreen onLoadLayout={onLoadLayout} isDarkMode={isDarkMode} />
    );
  }

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

          <Stack.Screen
            name="CastViewAll"
            component={CastViewAll}
            options={{ title: "CastViewAll" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContextProvider>
  );
}
