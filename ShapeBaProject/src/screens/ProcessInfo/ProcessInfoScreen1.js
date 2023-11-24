import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from '@expo/vector-icons';
import Calendar from "../../components/Calendar";
import { useDispatch, useSelector } from "react-redux";
import {
  processInfoSelector,
  // setSelectedStartDate,
  setSelectedSex,
  setWeight,
  setHeight,
  setOpenStartDatePicker,
  setBirthdate, // เพิ่ม import setBirthdate
  setAge,
} from "../../store/slice/processInfoSlice1";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Dropdown } from "react-native-element-dropdown";
import { set } from "react-hook-form";

export const progressCircle = (number, color, textcolor) => {
  return (
    <View style={styles.uiItem}>
      <View style={[styles.circle, { backgroundColor: color, elevation: 3 }]}>
        <Text style={[styles.uiText, { color: textcolor }]}>{number}</Text>
      </View>
    </View>
  );
};

const SignupSchema = Yup.object().shape({
  weight: Yup.number()
    .required("Enter Your Weight !"),
  height: Yup.number()
    .required("Enter Your Height !"),
  selectedSex: Yup.string()
    .notOneOf(["default"], "Select Sex !")
    .required("Select Sex !"),
});

const ProcessInfoScreen1 = ({ navigation }) => {
  const dispatch = useDispatch();
  const processInfo = useSelector(processInfoSelector);
  // dispatch(setBirthdate(''))
  console.log("Firstttttttttttt >>>> ", processInfo.birthdate)
  //bitrhdate
  const [birthDate, setBirthDate] = useState('')
  const [birthDateError, setBirthDateError] = useState('')

  const openStartDatePicker = processInfo.openStartDatePicker;
  const handleOnPressStartDate = () => {
    dispatch(setOpenStartDatePicker(!openStartDatePicker));
    console.log("check open")
    // console.log("check ope")
  };

  const sex = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "FeMale" },
  ];

  return (
    <Formik
      initialValues={{
        weight: '',
        height: '',
        selectedSex: '',
      }}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        // Handle submit logic here
      }}
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
          <View style={{ marginTop: 60, marginRight: 90 }}>
            <Text style={styles.Texttop}>Let’s Get Start</Text>
            <Text style={styles.Textbottom}>Track Your Daily Intake</Text>
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
              {progressCircle(1, "#EC744A", "white")}
              <View style={styles.line}></View>
              {progressCircle(2, "white", "#EC744A")}
              <View style={styles.line}></View>
              {progressCircle(3, "white", "#EC744A")}
            </View>
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <View style={styles.inputRowContainer}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text
                    style={{
                      ...styles.inputLabel,
                      fontWeight: "bold",
                      marginLeft: 5,
                      color: "#575757",
                      marginTop: 30,
                    }}
                  >
                    Weight
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={values.weight}
                    onChangeText={(text) => {
                      handleChange("weight")(text);
                      dispatch(setWeight(Number(text)));
                    }}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  {errors.weight && (
                    <Text style={styles.errorsText}>{errors.weight}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...styles.inputLabel,
                      fontWeight: "bold",
                      marginLeft: 5,
                      color: "#575757",
                      marginTop: 30,
                    }}
                  >
                    Height
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={values.height}
                    onChangeText={(text) => {
                      handleChange("height")(text);
                      dispatch(setHeight(Number(text))); // แปลงค่า text เป็น number
                    }}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  {errors.height && (
                    <Text style={styles.errorsText}>{errors.height}</Text>
                  )}
                </View>
              </View>
              <View style={styles.inputRowContainer}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...styles.inputLabel,
                      fontWeight: "bold",
                      marginLeft: 5,
                      color: "#575757",
                      marginTop: 30,
                    }}
                  >
                    Birth Date
                  </Text>
                  <View>
                    <TouchableOpacity onPress={handleOnPressStartDate}>
                      <TextInput
                        editable={false}
                        style={styles.input}
                        value={birthDate}
                        placeholder=""

                      />
                    </TouchableOpacity>
                    {birthDateError ? (
                      <Text style={styles.errorsText}>{birthDateError}</Text>
                    ) : null}

                    <Calendar
                      openStartDatePicker={processInfo.openStartDatePicker}
                      handleOnPressStartDate={handleOnPressStartDate}
                      setSelectedStartDate={(date) => {
                        setBirthDate(date)
                        dispatch(setBirthdate(date))
                        setBirthDateError('') // ล้าง error ทุกครั้งที่มีการแก้ไขค่า
                      }
                      }
                    />
                  </View>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginLeft: 5,
                      color: "#575757",
                      marginTop: 30,
                    }}
                  >
                    Sex
                  </Text>
                  <Dropdown
                    style={styles.dropdownStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={sex}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder=""
                    value={values.selectedSex}
                    onChange={(item) => {
                      handleChange("selectedSex")(item.value);
                      dispatch(setSelectedSex(item.value)); // ส่งไปยัง Redux store
                    }}
                  />
                  {errors.selectedSex && (
                    <Text style={styles.errorsText}>{errors.selectedSex}</Text>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.signupContainer}>
              <TouchableOpacity
                style={styles.btn3}
                onPress={() => {
                  //check birthdate
                  if (birthDate == '') {
                    setBirthDateError('Enter Your BirthDate !')
                    return;
                  }
                  else if (errors.weight || errors.height || errors.selectedSex) {
                    return;
                  }
                  else {
                    navigation.navigate("ProcessInfoScreen2")
                  }
                }}
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
  Texttop: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 5,
  },
  Textbottom: {
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
  input: {
    marginTop: 20,
    backgroundColor: "#f0f0f0",
    color: "#333",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
    width: 160,
    height: 50,
  },
  inputRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
    width: "80%",
  },
  signupContainer: {
    alignItems: "center",
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
  img: {
    width: 35,
    height: 35,
  },
  errorsText: {
    fontSize: 12,
    color: "#C03232",
    marginLeft: 15,
    marginTop: 5
  },
  dropdownStyle: {
    borderRadius: 25,
    paddingLeft: 15,
    backgroundColor: "#f0f0f0",
    height: 50,
    marginTop: 20,
    width: 160,
  },
});

export default ProcessInfoScreen1;
