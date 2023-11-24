import React, { useState, useEffect } from "react";
import CurrentWeightPopup from "../../components/CurrentWeight";
import History from "../../components/History";
import { ProgressBar, MD3Colors } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { PaperProvider } from "react-native-paper";
//redux
import { useDispatch, useSelector } from "react-redux";
import { userSelector, setUserId, setUserEmail } from "../../store/slice/userSlice";
import { setStateSignUp } from "../../store/slice/frontEndSlice";
// Firebase
import { AUTH } from "../../../firebase-cofig";
import { processInfoSelector } from "../../store/slice/processInfoSlice1";
import PushNotification from 'react-native-push-notification';
import { getGoalById } from "../../store/slice/processInfoSlice1";
import { useFocusEffect } from "@react-navigation/native";



const ProfileScreen = ({ navigation }) => {

  // CurrentweightPopup
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);

  const processInfo = useSelector(processInfoSelector);

  // console.log("Start WEIGHT > ", processInfo.weight)
  // console.log("PROCESS > ", Math.max(((processInfo.currentweight - processInfo.weight) / (processInfo.goalweight - processInfo.weight)) * 1, 0).toFixed(1));

  const [result, setResult] = useState(0); // ประกาศ state result
  const [goalTDEE, setGoalTDEE] = useState(0);
  const [startWeight, setStartWeight] = useState(0);
  const [goalweightDB, setGoalweightDB] = useState(0);
  const [heightDB, setheightDB] = useState(0);
  const [activitylevalDB, setActivitylevelDB] = useState(0);
  const [userGoal, setUserGoal] = useState([]);
  const [rerender, setRerender] = useState(false);
  const [currentweightDB, setCurrentweightDB] = useState(0);


  const getUserInfo = async () => {


    const goal = await getGoalById()
    // const index = goal[0].historyWeight.length-1
    setGoalTDEE(goal[0].TDEE)
    setStartWeight(goal[0].historyWeight[0].weight)
    setGoalweightDB(goal[0].goalWeight)
    setheightDB(goal[0].height)
    setActivitylevelDB(goal[0].activityLevel)
    // setCurrentweightDB(goal[0].historyWeight[4].weight)

  }

  useFocusEffect(
    React.useCallback(() => {
      getUserInfo();
      console.log(">>>>>>>>>>>>>>>PPPPfchsdjffp", goalweightDB, typeof goalweightDB)
      if (goalweightDB == 0) {


      }
      if (goalweightDB - startWeight !== 0) {
        const calculatedProgress = parseFloat(Math.max(
          Math.min(
            ((processInfo.currentweight - startWeight) / (goalweightDB - startWeight
            )),
            1
          ),
          0
        ).toFixed(1))
        console.log("calculatedProgress: ", calculatedProgress, typeof calculatedProgress);
        setResult(calculatedProgress); // กำหนดค่า result ที่ถูกคำนวณ
      }
    }, [])
  );


  console.log("Result: ", typeof result);

  // progressPopup
  const [progressWeight, setProgressWeight] = React.useState(false);
  const showProgressWeight = () => setProgressWeight(true);

  const [selectedSex, setSelectedSex] = useState("male");
  const [isEnabled, setIsEnabled] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const userStore = useSelector(userSelector);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };


  return (
    <PaperProvider >
      <View className="bg-white">


        <History
          isVisible={progressWeight}
          setVisible={setProgressWeight}
        />
        <CurrentWeightPopup isVisible={visible} setVisible={setVisible} />
      </View>
      <ScrollView>
        <StatusBar
          barStyle="dark-content"
          animated={true}
          backgroundColor="#fff"
        />

        <SafeAreaView
          style={{
            backgroundColor: "#FFFFFF", // เปลี่ยนเป็นสีขาว
            alignItems: "center",
            flex: 1,
            paddingBottom: 20,
          }}
        >
          <View style={styles.header}>


            <Image
              source={require("../../../assets/img/Icon.jpg")}
              style={styles.img}
              resizeMode="contain"
            />
          </View>
          {/* ปุ่มแสดงprogress */}
          <TouchableOpacity
            style={styles.progress}
            onPress={showProgressWeight}
          >
            <View
              style={(styles.progressbar,
                { flexDirection: "row", alignItems: "center" })
              }
            >
              <View style={{ marginRight: 10 }}>
                <Text style={{ color: "#fff" }}>Start</Text>
                <Text style={{ color: "#fff" }}>{startWeight} Kg</Text>
              </View>

              <View>
                <ProgressBar
                  progress={result}
                  color={"#EC744A"}
                  className="h-1 rounded"
                  style={{
                    width: 200,
                    height: 12,
                    marginTop: -5,
                  }}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: "#fff" }}>Goal</Text>
                <Text style={{ color: "#fff" }}>{goalweightDB} Kg</Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* Information */}
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              height: 30,
              width: 30,
              borderRadius: 20,
              marginTop: 15,
              marginLeft: 300,
              alignItems: 'center'
            }}
            onPress={() => navigation.navigate("InformationScreen")}
          >
            <Image
              source={require("../../../assets/img/icons8-i.png")}
              style={{ width: 20, height: 35, marginTop: -4 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.information}></TouchableOpacity>
          <View style={styles.Details}>
            <View className="flex-row justify-between" style={styles.boxStyle}>
              <Image
                source={require("../../../assets/img/icons8-fire.png")}
                style={{ width: 25, height: 35, marginTop: -5 }}
                resizeMode="contain"
              />
              <Text className="mb-5 mr-40" style={styles.textStyle}>
                TDEE
              </Text>
              <Text className="mb-5" style={styles.textProgress}>
                {goalTDEE} cal
              </Text>
            </View>
            <View
              className="flex-row justify-between mt-4"
              style={styles.boxStyle}
            >
              <Image
                source={require("../../../assets/img/icons8-shutdownpng.png")}
                style={{ width: 25, height: 35, marginTop: -5 }}
                resizeMode="contain"
              />
              <Text className="mb-5 mr-[135px]" style={styles.textStyle}>
                Start Weight
              </Text>
              <Text className="mb-5" style={styles.textProgress}>
                {startWeight} kg
              </Text>
            </View>
            <View className="flex-row justify-between" style={styles.boxStyle}>
              <Image
                source={require("../../../assets/img/icons8-goal-100.png")}
                style={{ width: 25, height: 35, marginTop: 15 }}
                resizeMode="contain"
              />
              <Text className="mb-5 mt-5 mr-[140px]" style={styles.textStyle}>
                Goal Weight
              </Text>
              <Text className="mb-5 mt-5" style={styles.textProgress}>
                {goalweightDB} kg
              </Text>
            </View>
            <View className="flex-row justify-between" style={styles.boxStyle}>
              <Image
                source={require("../../../assets/img/icons8-height-100.png")}
                style={{ width: 25, height: 35, marginTop: 15 }}
                resizeMode="contain"
              />
              <Text className="mb-5 mt-5 mr-[165px]" style={styles.textStyle}>
                Height
              </Text>
              <Text className="mb-5 mt-5" style={styles.textProgress}>
                {heightDB} cm
              </Text>
            </View>
            <View className="flex-row justify-between" style={styles.boxStyle}>
              <Image
                source={require("../../../assets/img/icons8-swimming-100.png")}
                style={{ width: 25, height: 35, marginTop: 15 }}
                resizeMode="contain"
              />
              <Text className="mb-5 mt-5 mr-14" style={styles.textStyle}>
                Activity Level
              </Text>
              <Text className="mb-5 mt-5" style={styles.textProgress}>
                {activitylevalDB}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={showDialog}
            style={{
              width: 350,
              height: 50,
              backgroundColor: "white",
              flexDirection: "row",
              borderRadius: 30,
              alignItems: "center",
              elevation: 3,
              paddingLeft: 20,
              marginTop: 15,
            }}
          >
            <Image
              source={require("../../../assets/img/icons8-weight-100.png")}
              style={{ width: 25, height: 35 }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: "#025146",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
                justifyContent: "flex-start",
                marginLeft: 5,
              }}
            >
              Update Weight
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.StartNewGoal}
            onPress={() => navigation.navigate("StartNewGoalScreen")}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Start New Goal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 350,
              height: 50,
              backgroundColor: "white",
              flexDirection: "row",
              borderRadius: 30,
              alignItems: "center",
              elevation: 3,
              paddingLeft: 20,
              marginBottom: 10,
              marginTop: 20,
            }}
            onPress={() => navigation.navigate("HistoryScreen")}
          >
            <Image
              source={require("../../../assets/img/icons8-history-100.png")}
              style={{ width: 25, height: 35 }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: "#025146",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
                justifyContent: "flex-start",
                marginLeft: 5,
              }}
            >
              History
            </Text>
          </TouchableOpacity>

          {/* logout button */}
          <TouchableOpacity
            style={styles.btnLogout}
            onPress={() => {
              dispatch(setUserEmail(''))
              dispatch(setUserId(''))
              dispatch(setStateSignUp(false))
              AUTH.signOut()
              console.log('logout', userStore.userId, userStore.userEmail)
            }}
          >
            <Text
              style={{
                color: "#EC744A",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Log out
            </Text>
          </TouchableOpacity>
        </SafeAreaView>

      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
    alignItems: "center",
  },

  img: {
    width: 140,
    height: 140,
    // marginTop: 0,
  },
  icon: {
    width: 25,
    height: 35,
    marginTop: 3,
    marginLeft: 20,
  },
  header: {
    height: 190,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    elevation: 5,
  },
  progress: {
    backgroundColor: "#025146",
    borderRadius: 30,
    width: 350,
    height: 150,
    marginTop: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  Details: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: 350,
    height: 320,
    marginTop: 15,
    padding: 20,
    elevation: 5,
  },
  switchFrame: {
    height: 50,
    width: 350,
    margin: 10,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
  },
  switchText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#025146",
    marginLeft: 10,
  },
  btnLogout: {
    height: 45,
    width: 180,
    backgroundColor: "#FFF",
    borderRadius: 30,
    elevation: 3,
    marginTop: 15,
    justifyContent: "center",
  },
  StartNewGoal: {
    backgroundColor: "#EC744A",
    borderRadius: 30,
    width: 350,
    height: 50,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 1,
    elevation: 3,
  },
  boxStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#A4A4A4",
    paddingVertical: 0.1,
  },
  textStyle: {
    color: "#025146",
    fontWeight: "bold",
    fontSize: 16,
  },
  textProgress: {
    color: "#575757",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagedetials: {
    width: 25,
    height: 35,
  },
  information: {},
});

export default ProfileScreen;
