import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          height: 500,
          width: "100%",
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Progress.Bar progress={0.8} width={800}/>
      </View>
    </SafeAreaView>
  );
}
