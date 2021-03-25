import React from "react";
import { View, StyleSheet, Text } from "react-native";
function ChipGroup(props) {
  return (
    <View style={styles.itemGroup}>
      {props.datas.map((item, index) => {
        return (
          <View style={styles.chipitem} key={index}>
            <Text
              style={{
                color: "#222",
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
    borderColor: "#0E0E0E",
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
