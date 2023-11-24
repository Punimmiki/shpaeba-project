import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { processInfoSelector } from "../store/slice/processInfoSlice1";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
// firebase
import {
  db,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
} from "../../firebase-cofig";
// Redux
import {
  getUserId,
  setUserEmail,
  userSelector,
} from "../store/slice/userSlice";
import { FlatList } from "react-native-gesture-handler";

const History = (props) => {
  const dispatch = useDispatch();
  const processInfo = useSelector(processInfoSelector);
  const isvisible = props.isVisible;

  const [showProcess, setShowProcess] = useState([]);
  const getHistory = async () => {
    const userId = await getUserId();
    try {
      const querySnapShot = query(
        collection(db, "goal"),
        where("user_id", "==", userId),
        where("status", "==", "doing")
      );
      const goalDocs = await getDocs(querySnapShot);

      goalDocs.forEach((doc) => {
        const goalData = doc.data();
        const historyWeight = goalData.historyWeight;
        setShowProcess(historyWeight);
      });
    } catch (error) {
      console.log("ERROR GET DATA >> ", error);
    }
    console.log("HISTORY GOAL DATA >>> ", showProcess);
  };

  useFocusEffect(
    React.useCallback(() => {
      getHistory();
      return () => {
        setShowProcess([]);
        
      };
    }, [isvisible])
  );

  const hideDialog = () => {
    props.setVisible((prev) => !prev);
  };

  const renderData = ({ item }) => {
    return (
      <View style={{}}>
        <View className="flex-row items-center ">
          <View className="rounded-full bg-[#EC744A] w-3 h-3 absolute left-[1px]"></View>
          <Text
            style={{
              color: "#025146",
              marginLeft: 30,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {item.weight} Kg
          </Text>
        </View>
        <Text
          style={{
            color: "#4B4B4B",
            marginLeft: 30,
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 7,
          }}
        >
          {item.date}
        </Text>
      </View>
    );
  };

  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: "white" }}
        visible={isvisible}
        onDismiss={hideDialog}
      >
        <Dialog.Content style={{}}>
          <Text style={{ color: "#025146", fontSize: 18, fontWeight: "bold" }}>
            Progress Weight
          </Text>
          <View
            className="items-center"
            style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}
          >
            <Text
              style={{
                marginLeft: 4,
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Start:
            </Text>
            <Text
              className="text-sm"
              style={{
                marginLeft: 4,
                color: "#025146",
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 4,
              }}
            >
              {processInfo.weight} Kg
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: 15,
                height: 15,
                marginLeft: 20,
              }}
            />
            <View
              style={{
                height: "100%",
                width: 2,
                backgroundColor: "#025146", // เปลี่ยนสีเป็นสีส้ม
                marginTop: 5,
                marginLeft: -8,
                zIndex: 0, // ให้เส้นสีเขียวอยู่ด้านล่าง
              }}
            />
            <View>
              {showProcess.map((item, index) => (
                <View key={index} style={{}}>
                   {(index === 0) ? null : (
                  <View>
                  <View className="flex-row items-center mt-3">
                    <View className="rounded-full bg-[#EC744A] w-3 h-3 absolute left-[-7px]"></View>
                    <Text
                      style={{
                        color: "#025146",
                        marginLeft: 30,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {item.weight} Kg
                    </Text>
                    
                  </View>
                  <Text
                    style={{
                      color: "#4B4B4B",
                      marginLeft: 30,
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 7,
                    }}
                  >
                    {item.date}
                  </Text>
                  </View>
                )}
                </View>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
            <Text
              style={{
                marginLeft: 4,
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Goal:
            </Text>
            <Text
              style={{
                marginLeft: 4,
                color: "#025146",
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              {processInfo.goalweight} Kg
            </Text>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default History;
