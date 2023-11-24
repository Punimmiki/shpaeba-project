import React, {useState} from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { processInfoSelector } from "../store/slice/processInfoSlice1";
import {
  setCurrentWeight
} from "../store/slice/processInfoSlice1";
// firebase
import { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, query, where } from '../../firebase-cofig'
// Redux
import { getUserId, setUserEmail, userSelector } from '../store/slice/userSlice'

const currentDate = new Date();
const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0')
const year = currentDate.getFullYear();
const today = `${day}/${month}/${year}` // String type

 const CurrentWeightPopup = (props) => {
   const visible  = props.isVisible
   console.log(props.isVisible);
   const processInfo = useSelector(processInfoSelector);
   const dispatch = useDispatch();
  //  const [visible, setVisible] = React.useState(false);
  //  setVisible(isVisible)
  //  console.log("isVisible: " + visible)

   const hideDialog = () => {props.setVisible((prev)=>!prev)}

   const [weightInput, setWeightInput] = useState("")

  const updateWeightHandler = async (weightInput) => {
    dispatch(setCurrentWeight(Number(weightInput)));
    try {
      const userId = await getUserId()
      const querySnapShot = query(collection(db, "goal"),
        where("user_id", "==", userId),
        where("status", "==", "doing")
      )
      const goalDocs = await getDocs(querySnapShot)
      goalDocs.forEach((doc) => {
        const goalData = doc.data()
        const historyWeight = goalData.historyWeight || []

        const newWeight = {
          date: today,
          weight: parseFloat(weightInput)
        }

        historyWeight.push(newWeight)
        updateDoc(doc.ref, {
          historyWeight: historyWeight
        })
        .then(() => {
          hideDialog()
          console.log("<<< UPDATED WEIGHT SUCCESS >>>")
        })
        .catch((error) => {
          console.log("ERROR UPDATE WEIGHT >> ", error)
        })
      })
    }
    catch (error) {
      console.log("ERROR >> ", error)
    }
  }

  return (
    <View
      style={{
        marginTop: 20,
        justifyContent:'center'
      }}
    >
      <Portal>
        <Dialog
          style={{ backgroundColor: "#fff",justifyContent:'center', alignItems:'center' }}
          visible={visible}
          onDismiss={hideDialog}
        >
          <Dialog.Content
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/img/icons8-shutdownpng.png")}
              style={{ width: 25, height: 35, marginTop: -5 }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: "#025146",
                marginLeft: 10,
                marginBottom: 5,
                fontWeight: "bold",
              }}
            >
              Update Weight
            </Text>
            <TextInput
              style={{
                marginBottom: 30,
                marginLeft: 100,
                borderBottomWidth: 1,
                paddingTop: 10,
                paddingStart: 17,
                width: 45,
                borderColor: "#575757",
                
              }}
              value={weightInput}
              onChangeText={(textWeight) => setWeightInput(textWeight)}
              keyboardType="numeric" // ตั้งค่าให้ใช้แป้นพิมพ์ตัวเลขเท่านั้น
              placeholder="0" // ตั้งค่า placeholder ถ้าต้องการ
            />
            <Text
              style={{
                color: "#025146",
                marginLeft: 10,
                marginBottom: 5,
                fontWeight: "bold",
              }}
            >
              kg
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={{
                height: 40,
                width: 100,
                borderWidth: 2,
                borderColor: "#025146",
                backgroundColor: "#fff",
              }}
              onPress={hideDialog}
            >
              <Text style={{ color: "#025146", fontWeight: "bold" }}>
                Cancel
              </Text>
            </Button>
            <Button
              style={{ backgroundColor: "#025146", height: 40, width: 100 }}
              onPress={() => updateWeightHandler(weightInput)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Done</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default CurrentWeightPopup;
