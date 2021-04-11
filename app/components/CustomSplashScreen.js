import React, { useEffect } from "react";
import { View, Image } from "react-native";
function CustomSplashScreen(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: props.isDarkMode ? "#222124" : "#fff",
      }}
      onLayout={props.onLoadLayout}
    >
      <Image
        source={require("./../assets/popcorn.png")}
        style={{ width: 196, height: 196 }}
      />
    </View>
  );
}

export default CustomSplashScreen;
