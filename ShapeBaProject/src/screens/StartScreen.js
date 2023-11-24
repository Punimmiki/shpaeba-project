import { translate } from "@shopify/react-native-skia";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";


const StartScreen = ({ navigation }) => {
  const [scaleAnimate] = useState(new Animated.Value(0))
  React.useEffect(() => {
    Animated.spring(
      scaleAnimate,
      {
        toValue: 1,
        friction: 2,
        useNativeDriver: true
      }
    ).start();
  }, [])

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/img/Icon.jpg")}
        style={[styles.img, { transform: [{ scale: scaleAnimate }] }]}
        resizeMode="contain"
      />
      <View>
        <TouchableOpacity
          style={styles.btn1}
          onPress={() => navigation.navigate('SignInScreen')}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 20, textAlign: 'center' }}>
            Start
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
  },
  img: {
    height: 220,
    width: 200,
    marginTop: 200
  },
  btn1: {
    height: 50,
    width: 270,
    borderRadius: 30,
    backgroundColor: "#025146",
    justifyContent: 'center',
    elevation: 5,
    marginTop: 280
  },
  textbtn1: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    marginTop: 10,
  },
});

export default StartScreen;
