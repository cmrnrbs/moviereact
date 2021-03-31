import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import PagerView from "react-native-pager-view";
import Constants from "expo-constants";
import DotIndicator from "../components/DotIndicator";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
function AppIntro(props) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        onPageSelected={(e) => setSelectedIndex(e.nativeEvent.position)}
        initialPage={0}
      >
        <View key="1" style={styles.page}>
          <Text style={styles.title}>Çevrimdışı Veritabanı</Text>
          <View style={styles.circle}>
            <Image
              style={{ width: 48, height: 48, tintColor: "white" }}
              source={require("./../assets/data.png")}
            />
          </View>
          <Text style={styles.subtitle}>
            Kendi favori listenizi oluşturarak{"\n"}internet olmadan listenizde
            gezinin.
          </Text>
        </View>
        <View key="2" style={styles.page}>
          <Text style={styles.title}>Milyonlarca Film</Text>
          <View style={styles.circle}>
            <Image
              style={{ width: 48, height: 48, tintColor: "white" }}
              source={require("./../assets/movies.png")}
            />
          </View>
          <Text style={styles.subtitle}>Milyonlarca filme anında ulaşın</Text>
        </View>
        <View key="3" style={styles.page}>
          <Text style={styles.title}>Çevirme Özgürlüğü</Text>
          <View style={styles.circle}>
            <Image
              style={{ width: 48, height: 48, tintColor: "white" }}
              source={require("./../assets/translate.png")}
            />
          </View>
          <Text style={styles.subtitle}>
            Anlamadığınız film detaylarını tek dokunuşla kendi dilinize çevirin'
          </Text>
        </View>
        <View key="4" style={styles.page}>
          <Text style={styles.title}>Gece Modu</Text>
          <View style={styles.circle}>
            <Image
              style={{ width: 48, height: 48, tintColor: "white" }}
              source={require("./../assets/moonmode.png")}
            />
          </View>
          <Text style={styles.subtitle}>
            Geceleri gözünüzü yormadan rahatça gezinin
          </Text>
        </View>
        <View key="5" style={styles.page}>
          <Text style={styles.title}>Önceden Bildirim</Text>
          <View style={styles.circle}>
            <Image
              style={{ width: 48, height: 48, tintColor: "white" }}
              source={require("./../assets/notification.png")}
            />
          </View>
          <Text style={styles.subtitle}>
            Favori listenizdeki filmeler vizyon{"\n"}tarihinden önce size bilgim
            gelsin.
          </Text>
          <TouchableWithoutFeedback
            onPress={async () => {
              await AsyncStorage.setItem("isFirstRun", "false");
              props.navigation.navigate("MainRoot");
            }}
          >
            <View style={styles.button}>
              <Text style={{ color: "white", fontFamily: "poppins-l" }}>
                HADİ BAŞLAYALIM
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </PagerView>
      <View
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
          alignItems: "center",
        }}
      >
        <DotIndicator activeIndex={selectedIndex} dotSize={8} itemLength={5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: "white",
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  title: {
    fontFamily: "poppins-sb",
    fontSize: 20,
    marginBottom: 20,
  },
  circle: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: "#B1B1B1",
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontFamily: "poppins-l",
    fontSize: 16,
    paddingHorizontal: 20,
    textAlign: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
});

export default AppIntro;
