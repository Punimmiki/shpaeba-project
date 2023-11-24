import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import { rotate } from "@shopify/react-native-skia";

const InformationScreen = ({ navigation }) => {
  return (
    
    <View style={styles.contrainer}>
      
      <View style={styles.header}>
        <View
          style={{
            width: 370,
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 30,
          }}
        >
          <View className="mt-6" style={{ flexDirection: "row" }}>
            <TouchableOpacity 
            style={{ marginRight: 15, marginTop: 3 }}
            onPress={() => navigation.goBack()}
            >
              <AntDesign name="leftcircleo" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white mb-2 text-xl font-bold">
              Information
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{ justifyContent: "center", alignItems: "center", margin: 20 }}
      >
        <View style={styles.BoxBMR}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{ color: "#025146", fontWeight: "bold", fontSize: 20 }}
            >
              BMR
            </Text>
            <Text
              className="mt-1"
              style={{ color: "#575757", fontSize: 15, marginLeft: 3 }}
            >
              (Basal Metabolic Rate)
            </Text>
          </View>
          <Text style={{ fontSize: 16, marginTop: 5 }}>
            Represents the amount of energy or calories that your body needs to
            maintain basic physiological functions while at rest.
          </Text>
        </View>
        <View style={styles.BoxTDEE}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{ color: "#025146", fontWeight: "bold", fontSize: 20 }}
            >
              TDEE
            </Text>
            <Text
              className="mt-1"
              style={{ color: "#575757", fontSize: 15, marginLeft: 3 }}
            >
              (Total Daily Energy Expenditure)
            </Text>
          </View>
          <Text style={{ fontSize: 16, marginTop: 5 }}>
            Stands for Total Daily Energy Expenditure. It represents the total
            number of calories your body needs in a day, taking into account all
            activities and functions, including your Basal Metabolic Rate (BMR)
            and physical activity level.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default InformationScreen;

const styles = StyleSheet.create({
  contrainer: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },
  header: {
    backgroundColor: "#025146",
    height: 130,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  BoxBMR: {
    backgroundColor: "white",
    width: 350,
    height: 180,
    borderRadius: 30,
    elevation: 3,
    padding: 25,
  },
  BoxTDEE: {
    backgroundColor: "white",
    width: 350,
    height: 210,
    borderRadius: 30,
    elevation: 3,
    padding: 25,
    margin: 20,
  },
});
