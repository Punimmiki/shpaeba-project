// import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Header, Input } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  processInfoSelector,
  setWeight,
  setHeight,
  setaccomplish,
  setGoalweight,
  setActivitylevel,
  setUserIdprocess,
  setSelectedSex,
  setBirthdate,
  setTdee
} from "../../store/slice/processInfoSlice1";
import { calculateTDEE } from "../../store/slice/processInfoSlice1";
import { db, collection, getDoc, addDoc, doc, deleteDoc, updateDoc, arrayUnion, query, where } from '../../../firebase-cofig'
import { getUserId, getGoalById } from "../../store/slice/processInfoSlice1"
import { useFormik, Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  weight: Yup.number()
  .required('Weight is required'),
  height: Yup.number()
  .required('Height is required'),
  accomplish: Yup.string()
  .required('Accomplish is required'),
  goalweight: Yup.number()
  .required('Goal Weight is required'),
  activitylevel: Yup.string()
  .required('Activity Level is required')
});


const StartNewGoalScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const processInfo = useSelector(processInfoSelector);

  //update goal status
  const updateGoalStatus = async () => {
    try {
      const userGoal = await getGoalById(); // ดึง goal ID
      console.log("user goal", userGoal[0].key)
      const userId = await getUserId(); // ดึง user ID
      await updateDoc(doc(db, "goal", userGoal[0].key), {
        status: "done",
      });
      console.log("Goal update successfully");

    } catch (e) {
      console.log("Error update goal: " + e.message);
    }
  }

  const handleFinishButton = async (e1, e2, e3, e4, e5) => {
    try {
      if (e1 || e2 || e3 || e4 || e5) {
        console.log("checkfalse >>")
        return 
      }
      await updateGoalStatus()
      const userId = await getUserId(); // ดึง user ID
      const userDocRef = doc(db, 'user', userId); // ใช้ user ID ที่ได้จาก Redux state
      const userDocSnap = await getDoc(userDocRef);
      const userInfo = userDocSnap.data()
      console.log(userInfo.birthDate, userInfo.sex)

      dispatch(setSelectedSex(userDocSnap.data().sex))
      dispatch(setBirthdate(userDocSnap.data().birthDate))
      console.log("new goal", processInfo)
      //set new goal
      const tdee = calculateTDEE(processInfo);
      dispatch(setTdee(tdee))

    } catch (error) {
      console.error("Error get user: ", error);
    }
    navigation.navigate("Backtoprofile");
  }
  const accomplishData = [
    { label: "lose weight", value: "Lose weight" },
    { label: "maintain weight", value: "Maintain weight" },
    { label: "gain weight", value: "Gain weight" },
  ];
  const activitylevel = [
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
  const greenHeader = (navigation) => {
    return (

      <Header
        backgroundColor="#025146"
        containerStyle={styles.header}
        leftComponent={
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ marginRight: 15, marginTop: 3 }}
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="leftcircleo" size={25} color="white" />
            </TouchableOpacity>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                width: "200%",
                fontWeight: "bold",
              }}
            >
              Start New Goal
            </Text>
          </View>
        }
      ></Header>
    );
  };

  return (
    <Formik
      initialValues={{
        weight: '',
        height: '',
        accomplish: '',
        goalweight: '',
        activitylevel: ''

      }}
      validationSchema={validationSchema}
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
        <View style={styles.container}>
          {greenHeader(navigation)}
          <View
            className="mt-1"
            style={{ padding: 40, alignItems: "center", justifyContent: "center" }}
          >
            {/* weight and height */}
            <View className="flex-row">
              <View style={{ width: "50%" }}>
                <Text
                  style={{ marginLeft: 10 }}
                  className="text-[#575757] font-semibold text-base"
                >
                  Weight
                </Text>
                <TextInput
                  style={[styles.textbox, { marginRight: 5, marginTop: 10 }]}
                  value={values.weight}
                  onChangeText={(text) => {
                    handleChange("weight")(text);
                    dispatch(setWeight(Number(text)));
                  }}
                  keyboardType="decimal-pad"
                  maxLength={3}
                />
                {errors.weight && (
                  <Text style={styles.errorsText}>{errors.weight}</Text>
                )}
              </View>
              <View style={{ width: "50%" }}>
                <Text
                  style={{ marginLeft: 10 }}
                  className="text-[#575757] font-semibold text-base"
                >
                  Height
                </Text>
                <TextInput
                  style={[styles.textbox, { marginRight: 5, marginTop: 10 }]}
                  value={values.height}
                  onChangeText={(text) => {
                    handleChange("height")(text);
                    dispatch(setHeight(Number(text))); // แปลงค่า text เป็น number
                  }}
                  keyboardType="decimal-pad"
                  maxLength={3}
                />
                {errors.height && (
                  <Text style={styles.errorsText}>{errors.height}</Text>
                )}
              </View>
            </View>
            <View className="mt-6" style={{ width: "100%" }}>
              {/* accomplish */}
              <Text className="text-[#575757] font-semibold text-base pl-3">
                Accomplish
              </Text>
              <Dropdown
                style={[styles.dropdownStyle, { marginRight: 5, marginTop: 10 }]}
                selectedTextStyle={styles.selectedTextStyle}
                data={accomplishData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder=""
                value={values.accomplish}
                onChange={(item) => {
                  handleChange("accomplish")(item.value);
                  dispatch(setaccomplish(item.value)); // ส่งไปยัง Redux store
                }}
              />
              {errors.accomplish && (
                <Text style={styles.errorsText}>{errors.accomplish}</Text>
              )}
              {/* goal weight */}
              <View className="mt-6" style={{ width: "100%" }}>
                <Text
                  style={{ marginLeft: 10 }}
                  className="text-[#575757] font-semibold text-base"
                >
                  Goal Weight
                </Text>
                <TextInput
                  style={[styles.textbox, { marginRight: 5, marginTop: 10 }]}
                  value={values.goalweight}
                  onChangeText={(text) => {
                    handleChange("goalweight")(text);
                    dispatch(setGoalweight(Number(text))); // ให้แปลงค่าเป็น number
                  }}
                  keyboardType="decimal-pad"
                  maxLength={3}
                />
                {errors.goalweight && (
                  <Text style={styles.errorsText}>{errors.goalweight}</Text>
                )}
              </View>
              {/* activity level */}
              <Text className="text-[#575757] font-semibold text-base pl-3 mt-6">
                Activity Level
              </Text>
              <Dropdown
                style={[styles.dropdownStyle, { marginRight: 5, marginTop: 10 }]}
                selectedTextStyle={styles.selectedTextStyle}
                data={activitylevel}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder=""
                value={values.activitylevel}
                onChange={(item) => {
                  handleChange("activitylevel")(item.value);
                  dispatch(setActivitylevel(item.value)); // ส่งไปยัง Redux store
                }}
              />
              {errors.activitylevel && (
                <Text style={styles.errorsText}>{errors.activitylevel}</Text>
              )}
            </View>

            <View style={{ width: "100%", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.btnFinish}
                onPress={ () => handleFinishButton(errors.height, errors.weight, errors.goalweight, errors.accomplish, errors.activitylevel)}
              >
                <Text
                  className="font-bold text-white test-base"
                  style={{ fontSize: 18 }}
                >
                  Finish
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  header: {
    backgroundColor: "#025146",
    height: "18%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 100,
    width: "100%",
    paddingLeft: 20,
    flexDirection: "row",
    elevation: 2,
  },
  textbox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 20,
    // paddingVertical: 8,
    height: 50,
  },
  dropdownStyle: {
    borderRadius: 25,
    paddingLeft: 15,
    backgroundColor: "#f0f0f0",
    height: 50,
    paddingHorizontal: 20,

    // marginTop:10
  },
  btnFinish: {
    backgroundColor: "#EC744A",
    padding: 10,
    marginTop: 40,
    borderRadius: 25,
    width: "50%",
    alignItems: "center",
    marginBottom: 30,
    elevation: 2,
    height: 50,
    justifyContent: "center",
    marginTop: 70,
  },
  errorsText: {
    fontSize: 12,
    color: "#C03232",
    marginLeft: 15,
    marginTop: 5
  },
});

export default StartNewGoalScreen;
