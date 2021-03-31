import React from "react";
import { View } from "react-native";
function DotIndicator(props) {
  var data = [];
  for (let index = 0; index < props.itemLength; index++) {
    data.push("");
  }

  return (
    <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
      {data.map((item, index) => {
        return (
          <View
            style={{
              width: props.dotSize,
              height: props.dotSize,
              borderRadius: props.dotSize / 2,
              backgroundColor:
                index == props.activeIndex
                  ? props.activeColor != undefined
                    ? props.activeColor
                    : "black"
                  : props.inactiveColor != undefined
                  ? props.inactiveColor
                  : "grey",
              marginRight: index < props.itemLength - 1 ? 4 : 0,
            }}
            key={index}
          ></View>
        );
      })}
    </View>
  );
}

export default DotIndicator;
