import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import React from 'react'
import { processInfoSelector } from "../../store/slice/processInfoSlice1";
import { calculateTDEE, calculateTimeToGoal } from '../../store/slice/processInfoSlice1';
import { useDispatch, useSelector } from "react-redux";



const label = (img, text) => {

    return (
        <View style={styles.c1}>
            <Image source={img} style={{ width: 50, height: 50 }}></Image>
            <Text className="font-bold text-base text-Green ml-3">{text}</Text>
        </View>
    );

}

const Backtoprofile = ({ navigation }) => {
    const processInfo = useSelector(processInfoSelector);
    const { monthsToGoal } = calculateTimeToGoal(processInfo);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                animated={true}
                backgroundColor="#025146"
            />
            {/* <View>
                <Text className=" text-3xl text-white mt-14 font-bold">Scientificatically proven</Text>
            </View> */}
            <View style={styles.box1} className="rounded-full mt-10 ">
                <Text className="font-bold text-2xl text-Green mt-5">TARGET WEIGHT</Text>
                <Text className="font-bold text-2xl text-Green">{processInfo.goalweight} KG</Text>
                <Text className="font-bold text-lg text-Green">Your daily energy require</Text>
                <Text className="font-bold text-2xl text-Orange mt-3">{processInfo.tdee} Cals / Day</Text>
                <Text className="font-bold text-sm text-Green mt-3">during {monthsToGoal} month</Text>
            </View>
            <View>
            <Text className=" text-xl text-white mt-12 font-bold text-center">Fasting is natural.</Text>
            <Text className=" text-xl text-white mt-1 font-bold text-center">No calorie counting, no yo-yo effect.</Text>
            <Text className=" text-xl text-white mt-1 font-bold text-center">Enjoy food again.</Text>

            </View>
            {/* <View className="mt-11">
                {label(require("../../../assets/img/icons8-note.png"), "Record What You Eat")}
                {label(require("../../../assets/img/icons8-math.png"), "Calculate Calories")}
                {label(require("../../../assets/img/icons8-chart.png"), "Graph Summary ")}
                {label(require("../../../assets/img/icons8-fix.png"), "Customize menu list")}
            </View> */}
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("ProfileScreen")}>
                <Text className="text-base font-bold text-[#fff] ">back to profile</Text>
            </TouchableOpacity>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#025146',
        alignItems: 'center',
        justifyContent:'center'

    },
    box1: {
        backgroundColor: '#fff',
        width: "80%",
        height: "40%",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation:15

    },
    c1: {
        width: 290,
        height: 80,
        backgroundColor: 'white',
        marginBottom: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20
        // justifyContent: 'center',
    },
    img: {
        width: 50,
        height: 50,
    },
    btn: {
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
        marginTop: 50,
      },
});

export default Backtoprofile