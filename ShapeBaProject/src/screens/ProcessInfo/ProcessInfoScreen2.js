import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from "react-native";
import { progressCircle } from "./ProcessInfoScreen1";
import { useDispatch, useSelector } from "react-redux";
import { setaccomplish } from "../../store/slice/processInfoSlice1";
import { processInfoSelector } from "../../store/slice/processInfoSlice1";

const ProcessInfoScreen2 = ({ navigation }) => {
  const dispatch = useDispatch();
  const processInfo = useSelector(processInfoSelector);

  const handleSelectGoal = (selectedGoal) => {
    dispatch(setaccomplish(selectedGoal));
    navigation.navigate("ProcessInfoScreen3");
  };
  return (
    <View style={styles.contrainer}>
      <StatusBar
        barStyle="dark-content"
        animated={true}
        backgroundColor="#025146"
      />
      <View style={{ marginTop: 60, marginRight:100 }}>
        <Text style={styles.Letget}>Set Your Goal</Text>
        <Text style={styles.Trackyour}>Nutrition at a Glance</Text>
      </View>
      <View
        style={{
          marginTop: 20,
          backgroundColor: "#fff",
          width: "100%",
          height: "100%",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          margin: 20,
        }}
      >
        <View style={styles.uiContainer}>
          {progressCircle(1, "white", "#EC744A")}
          <View style={styles.line}></View>
          {progressCircle(2, "#EC744A", "white")}
          <View style={styles.line}></View>
          {progressCircle(3, "white", "#EC744A")}
        </View>
        <Text
          style={{
            ...styles.ifont,
            fontWeight: "bold",
            color: "#575757",
            marginTop: 50,
            textAlign: "center",
          }}
        >
          What do you want to accomplish?
        </Text>
        <View style={{alignItems:'center', margin:20}}>
            <TouchableOpacity
              style={styles.inputbetween}
              onPress={() => handleSelectGoal("Maintain weight")}
            >
              <Text style={styles.inputText}>Maintain</Text>
              <Text style={styles.inputText}>weight</Text>
            </TouchableOpacity>
            
            <View style={{flexDirection:'row', margin:20}}>
              <TouchableOpacity
                style={styles.inputL}
                onPress={() => handleSelectGoal("Lose weight")}
              >
                <Text style={styles.inputText}>Lose</Text>
                <Text style={styles.inputText}>weight</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.inputR}
                onPress={() => handleSelectGoal("Gain weight")}
              >
                <Text style={styles.inputText}>Gain</Text>
                <Text style={styles.inputText}>weight</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contrainer: {
    flex: 1,
    backgroundColor: "#025146",
    alignItems: "center",
  },
  Letget: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 5,
  },
  Trackyour: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 30,
  },
  uiContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  uiItem: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 0,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EC744A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth:1,
    borderColor:"#EC744A"
  },
  line: {
    height: 2,
    width: 65,
    backgroundColor: "#EC744A",
  },
  uiText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputbetween: {
    marginTop: 25,
    backgroundColor: "#1AA3BA",
    color: "#333",
    borderRadius: 20,
    height: 100,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    // marginLeft: 90,
  },
  inputR: {
    marginTop: 30,
    backgroundColor: "#FBBB57",
    color: "#333",
    borderRadius: 20,
    height: 100,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  inputL: {
    marginTop: 30,
    backgroundColor: "#EF8055",
    color: "#333",
    borderRadius: 20,
    height: 100,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    marginRight:70
  },
  ifont: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    width: "45%",
  },
  inputText: {
    color: "white",
    fontSize: 18,
    // fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProcessInfoScreen2;
