import React from "react";
import { View, Text, Image } from "react-native";
function CastItem(props) {
  const { isDarkMode, light, dark } = props.context;
  return (
    <View
      style={{
        marginRight: 10,
        flexDirection: "row",
        marginVertical: 10,
      }}
    >
      <Image
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
        }}
        source={{ uri: props.cast.profile_path }}
      />
      <View
        style={{
          flexDirection: "column",
          flexWrap: "wrap",
          justifyContent: "center",
          marginLeft: 10,
        }}
      >
        <Text
          style={{
            color: isDarkMode ? light.bg : dark.bg,
            fontFamily: "poppins-l",
          }}
        >
          {props.cast.name}
        </Text>
        <Text
          style={{
            color: isDarkMode ? light.bg : dark.bg,
            fontFamily: "poppins-l",
            fontSize: 12,
          }}
        >
          {props.cast.character}
        </Text>
      </View>
    </View>
  );
}

export default CastItem;
