import React from "react";
import { View, StyleSheet, Text } from "react-native";
function ChipGroup(props) {
  const { isDarkMode, light, dark } = props.context;
  return (
    <View style={styles.itemGroup}>
      {props.datas.map((item, index) => {
        return (
          <View
            style={[
              styles.chipitem,
              {
                borderColor: isDarkMode ? light.bg : "#0E0E0E",
              },
            ]}
            key={index}
          >
            <Text
              style={{
                color: isDarkMode ? light.bg : "#222",
                fontFamily: "poppins-r",
                fontSize: 11,
              }}
            >
              {item}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  itemGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chipitem: {
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 5,
    marginTop: 5,
  },
});

export default ChipGroup;
