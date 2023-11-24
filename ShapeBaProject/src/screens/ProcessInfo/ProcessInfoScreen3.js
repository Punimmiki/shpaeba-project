import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { progressCircle } from "./ProcessInfoScreen1";
import {
  setGoalweight,
  setActivitylevel,
} from "../../store/slice/processInfoSlice1";
import { useDispatch, useSelector } from "react-redux";
import { processInfoSelector } from "../../store/slice/processInfoSlice1";
import { saveUserInfo, setTdee, calculateTDEE} from "../../store/slice/processInfoSlice1";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Dropdown } from "react-native-element-dropdown";

const ProcessInfoScreen3 = ({ navigation }) => {
  const dispatch = useDispatch();
  const processInfo = useSelector(processInfoSelector);

  // เช็ค warining 
  const handleCalculateTDEE = () => {
    const { goalweight, weight, activitylevel } = processInfo;

    if (!goalweight || !activitylevel || !weight) {
      Alert.alert("warning", "Please fill in all required fields");
    } else if (weight - goalweight > 10) {
      Alert.alert("warning", "The entered weight is too high. Please enter a new value");
    } else {
      navigation.navigate("TapToStart");
    }
  };

  const activityLevel = [
    { label: "little or no exercise", value: "little or no exercise" },
    { label: "1-3 times/week", value: "1-3 times/week" },
    { label: "4-5 times/week", value: "4-5 times/week" },
    {
      label: "Intense exercise 6-7 times/week",
      value: "Intense exercise 6-7 times/week",
    },
    {
      label: "Very intense exercise daily",
      value: "Very intense exercise daily",
    },
  ];
  const handleSubmit = () => {
    // ทำตามการทำงานที่ต้องการทำเมื่อฟอร์มถูก submit
    handleCalculateTDEE();
    const tdee = calculateTDEE(processInfo);
    dispatch(setTdee(tdee))
    //save birth date & sex
    saveUserInfo(processInfo);
  };
  const SignupSchema3 = Yup.object().shape({
    goalweight: Yup.number().required("Enter Your GoalWeight !"),
    activitylevel: Yup.string()
      .notOneOf(["default"], "Select Activity Level !")
      .required("Select Activity Level !"),
  });

  return (
    <Formik
      initialValues={{
        goalweight: processInfo.goalweight,
        activitylevel: processInfo.activitylevel,
      }}
      validationSchema={SignupSchema3}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldTouched,
        isValid,
        handleSubmit,
      }) => (
        <View style={styles.contrainer}>
          <StatusBar
        barStyle="dark-content"
        animated={true}
        backgroundColor="#025146"
      />
          <View style={{ marginTop: 60, marginRight: 50 }}>
            <Text style={styles.Letget}>Add Goal Weight</Text>
            <Text style={styles.Trackyour}>Fuel Your Body Wisely</Text>
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
              {progressCircle(2, "white", "#EC744A")}
              <View style={styles.line}></View>
              {progressCircle(3, "#EC744A", "white")}
            </View>
            <View style={{ alignItems: "center", marginTop: 30 }}>
              <View style={styles.inputRowContainer}>
                <Text
                  style={{
                    ...styles.inputLabel,
                    fontWeight: "bold",
                    color: "#575757",
                    marginTop: 30,
                    marginLeft: 5,
                    fontSize: 16,
                  }}
                >
                  Goal Weight
                </Text>
                <TextInput
                  style={styles.inputGowieght}
                  value={values.goalweight.toString()} // ให้แปลงค่าเป็น string
                  onChangeText={(text) => {
                    handleChange("goalweight")(text);
                    dispatch(setGoalweight(Number(text))); // ให้แปลงค่าเป็น number
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                />
                {errors.goalweight && (
                  <Text style={styles.errorsText}>{errors.goalweight}</Text>
                )}
              </View>
              <View style={styles.inputRowContainer}>
                <Text
                  style={{
                    fontWeight: "bold",
                    marginLeft: 5,
                    color: "#575757",
                    marginTop: 10,
                    fontSize: 16,
                  }}
                >
                  Activity Level
                </Text>
                <Dropdown
                  style={styles.dropdownStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={activityLevel}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder=""
                  value={processInfo.activitylevel}
                  onChange={(item) => {
                    handleChange("activitylevel")(item.value);
                    dispatch(setActivitylevel(item.value)); // ส่งไปยัง Redux store
                  }}
                />
                {errors.activitylevel && (
                  <Text style={styles.errorsText}>{errors.activitylevel}</Text>
                )}
              </View>
            </View>
            <View style={styles.signupContainer}>
              <TouchableOpacity
                style={styles.btn3}
                onPress={handleSubmit} // เปลี่ยนจาก handleCalculateTDEE เป็น handleSubmit
              >
                <Image
                  source={require("../../../assets/img/Arrow.jpg")}
                  style={(styles.img, { width: 35, height: 35 })}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Formik>
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
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EC744A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EC744A",
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
  inputGowieght: {
    marginTop: 20,
    backgroundColor: "#f0f0f0",
    color: "#333",
    borderRadius: 25,
    height: 50,
    width: 330,
    paddingHorizontal: 20,
  },
  inputRowContainer: {
    marginBottom: 30,
  },
  signupContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 10,
    marginLeft: 260,
  },
  btn3: {
    paddingVertical: -2,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#025146",
  },
  dropdownStyle: {
    marginTop: 20,
    backgroundColor: "#f0f0f0",
    color: "#333",
    borderRadius: 25,
    height: 50,
    width: 330,
    paddingHorizontal: 20,
  },
  errorsText: {
    fontSize: 13,
    color: "#C03232",
    marginLeft: 10,
    marginTop: 10,
  },
});

export default ProcessInfoScreen3;
