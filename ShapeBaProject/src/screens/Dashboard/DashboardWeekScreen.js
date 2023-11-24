import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { BarChart } from '../../components/BarChart';
import React, { useState } from 'react'

import { getGoalById } from '../../store/slice/processInfoSlice1'
import { useFocusEffect } from '@react-navigation/native';



const ListFood = ({ item, index }) => {
    return (
        <>
            <View className="flex-row justify-between p-4">
                <View className="flex-row gap-6 pl-3 items-center">
                    <Text className="font-medium text-base text-Darkgray">{index+1} {item.name}</Text>
                </View>
                <Text className="font-medium text-base text-Darkgray mr-3">{item.calories} cals</Text>
            </View>
            <View className="border-b  border-Darkgray opacity-20" />
        </>

    )
}

const DashboardWeekScreen = () => {
    const data = [
        { name: 'Oatmeal', gram: 150, cal: 780 },
        { name: 'Tuna rice', gram: 150, cal: 780 },
        { name: 'Salad bacon', gram: 150, cal: 780 },
        { name: 'Chocmint', gram: 150, cal: 780 },
        { name: 'Chocmint55', gram: 150, cal: 780 },
    ];
    const [collectSumCalPerDay, setCollectSumCalPerDay] = useState(0) // for caculate average cal
    const [getTDEE, setTDEE] = useState(0)
    const [usedData, setUsedData] = useState([])

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
                    <View style={[styles.content, styles.c2]}>
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
                        <View className="-mt-10 mr-5">
                            <BarChart setUsedData={setUsedData} setCollectSumCalPerDay = {setCollectSumCalPerDay} collectSumCalPerDay={collectSumCalPerDay} getTDEE={getTDEE} />
                        </View>


                    </View>
                    <View style={[styles.content, styles.c1]}>
                        <Text className="text-white text-base font-bold p-2 pl-4" >Highest Food calories</Text>
                        <View style={[styles.content, styles.c3]}>
                            {
                                usedData.map((item, index) => <ListFood item={item} key={index} index={index} />)
                            }
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
        backgroundColor: '#EC744A',
        elevation: 10,
    },

    c2: {
        backgroundColor: 'white',
        elevation: 10,
        // height: 350
    },
    c3: {
        backgroundColor: 'white',
        marginTop: 0,
        marginBottom: -20,
        paddingTop: 20
    },
});

export default DashboardWeekScreen;