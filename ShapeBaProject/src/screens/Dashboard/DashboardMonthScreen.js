import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { LineChart } from '../../components/LineChart';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from '../../../firebase-cofig';

import { getGoalById } from '../../store/slice/processInfoSlice1'


const DashboardMonthScreen = () => {
    const [collectSumCalPerDay, setCollectSumCalPerDay] = useState(0) // for caculate average cal
    const [getTDEE, setTDEE] = useState(0)

    const fetchData = async () => {
        try {
            const getUserGoal = await getGoalById()
            setTDEE(getUserGoal[0].TDEE) ;
            console.log("tdee", getTDEE)
        }
        catch (error) {
            console.log("ERROR FETCH DATA")
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData()
        }, [])
    )

    return (
        <SafeAreaView >
            <ScrollView >
                <View style={styles.container}>
                    <View style={[styles.content, styles.c1]}>
                        <View className="flex-row">
                            <View>
                                <Text className="text-Darkgray mt-6 ml-6">Average</Text>
                                <View className="ml-6 flex-row">
                                    <Text className="text-lg font-bold mr-2">{collectSumCalPerDay.toFixed(2)} Cals</Text>
                                    <Image source={require('../../../assets/img/icons8-fire.png')}
                                        style={{ width: 20, height: 20, marginTop: 2 }} />
                                </View>
                            </View>
                            <View className="ml-5">
                                <Text className="text-Darkgray mt-6 ml-6">Goal</Text>
                                <View className="ml-6 flex-row">
                                    <Text className="text-lg font-bold mr-2">{getTDEE} Cals</Text>
                                </View>
                            </View>
                        </View>

                        <View className="">
                            <Text className="text-Darkgray text-xs text-right mt-8 mr-3"></Text>

                        </View>
                        {/* <View className="border-b  border-Darkgray opacity-50 " /> */}

                        <View className="mr-5" style={styles.chart}>
                            <LineChart setCollectSumCalPerDay = {setCollectSumCalPerDay} collectSumCalPerDay={collectSumCalPerDay} />
                        </View>


                    </View>
                    <View className="flex-row">
                        <View style={[styles.content, styles.c2]}>
                            <Text className="text-white text-base font-bold text-center">Your Progress</Text>
                            <Text className="text-white text-xl font-bold text-center mt-4">March</Text>
                            <Text className="text-white text-xl font-bold text-center">2023</Text>
                        </View>
                        <View style={[styles.content, styles.c3]}>
                            <Text className="text-Green text-base font-bold text-center">Reach Goal</Text>
                            <Text className="text-Green text-xl font-bold text-center mt-4">0/31</Text>
                            <Text className="text-Green text-xl font-bold text-center">Days</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FB',
        alignItems: 'center',

    },
    content: {
        width: 320,
        paddingBottom: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,

    },
    c1: {
        backgroundColor: 'white',
        elevation: 10,
        height: 300
    },
    c2: {
        backgroundColor: '#025146',
        borderTopEndRadius: 0,
        borderBottomEndRadius: 0,
        height: 160,
        width: "40%",
        elevation: 10,
        padding: 15,
        justifyContent: 'center',
    },
    c3: {
        backgroundColor: 'white',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        height: 160,
        width: "40%",
        elevation: 10,
        padding: 15,
        justifyContent: 'center',
    },
    chart: {
        marginTop: -130,
    }

});

export default DashboardMonthScreen;