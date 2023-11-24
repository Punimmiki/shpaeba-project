import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, TouchableHighlight, } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Header } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, where, } from '../../../firebase-cofig';
// icon
import { Ionicons } from '@expo/vector-icons';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getUserId } from '../../store/slice/userSlice';
import { useFocusEffect } from "@react-navigation/native";

const greenHeader = (navigation) => {
    return (
        <Header backgroundColor="#025146" containerStyle={styles.header}
            leftComponent={
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginRight: 15, marginTop: 3 }} onPress={() => navigation.goBack()}>
                        <AntDesign name="leftcircleo" size={25} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20, width: '200%', fontWeight: 'bold' }}>History</Text>
                </View>
            }
        >
        </Header>
    )
}

const goalHistory = [
    { id: 1, goalWeight: 45, startWeight: 50, startGoalDate: '26-01-2023', endWeight: 45, endGoalDate: '26-03-2023', history: [{ weight: 45, date: '26-01-2023' }, { weight: 43, date: '01-02-2023' }] },
    { id: 2, goalWeight: 40, startWeight: 53, startGoalDate: '26-01-2023', endWeight: 40, endGoalDate: '26-03-2023', history: [{ weight: 49, date: '26-01-2023' }, { weight: 46, date: '01-02-2023' }] },
    { id: 3, goalWeight: 50, startWeight: 49, startGoalDate: '26-01-2023', endWeight: 50, endGoalDate: '26-03-2023', history: [{ weight: 45, date: '26-01-2023' }, { weight: 43, date: '01-02-2023' }] },
    { id: 4, goalWeight: 55, startWeight: 60, startGoalDate: '26-01-2023', endWeight: 57, endGoalDate: '26-03-2023', history: [{ weight: 45, date: '26-01-2023' }, { weight: 43, date: '01-02-2023' }] },
    { id: 5, goalWeight: 55, startWeight: 60, startGoalDate: '26-01-2023', endWeight: 57, endGoalDate: '26-03-2023', history: [{ weight: 45, date: '26-01-2023' }, { weight: 43, date: '01-02-2023' }] },
];




const HistoryScreen = ({ navigation }) => {

    const [allGoal, setAllGoal] = useState([])
    // Get history goal by User ID
    const getAllGoal = async () => { // Pass the user ID as an argument
        try {
            const userId = await getUserId();
            console.log("history goal: ", userId)
            const querySnapshot = await getDocs(query(collection(db, "goal"), where("user_id", "==", userId), where("status", "==", "done"))); // Use the user's ID passed as an argument
            console.log("Total goal: ", querySnapshot.size);
            const tempDoc = [];
            querySnapshot.forEach((doc) => {
                tempDoc.push({ ...doc.data(), key: doc.id });
            });
            console.log("goal user", tempDoc);
            setAllGoal(tempDoc)

        } catch (error) {
            console.error("Error fetching user goal: ", error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getAllGoal();
            console.log("all goal: ", allGoal)
        }, [])
    );
    // Expand View
    const ExpandableView = ({ expanded = false, item }) => {
        return (
            <View className="mt-2" style={{ height: 'auto' }}>
                {item.historyWeight.map((history, index) => (
                    <View key={index}>
                        {(index === 0) || (index === item.historyWeight.length - 1) ? null : (
                            <View className='flex-row pl-4 pr-16 justify-between'>
                                <Text style={{ fontSize: 16, marginBottom: 3 }} className="pl-10">
                                    {history.weight} kg
                                </Text>
                                <Text style={{ fontSize: 16, color: 'darkgray' }}>
                                    {history.date}
                                </Text>

                            </View>
                        )}

                    </View>
                ))}
            </View>
        );
    };

    const [expandedItemIndex, setExpandedItemIndex] = useState(null);
    //one history list
    const historyListPattern = ({ item, index }) => {
        const isExpanded = expandedItemIndex === index
        // console.log("index: " + index + ", expand: ", isExpanded)
        const toggleExpand = (index) => {
            setExpandedItemIndex(isExpanded ? null : index);
        }
        return (
            <View className="pl-4 pr-4 mt-3 mb-3 flex-row items-center">
                {
                    item.historyWeight[item.historyWeight.length - 1].weight == item.goalWeight ?
                        <Image source={require('../../../assets/img/smile.png')} /> :
                        <Image source={require('../../../assets/img/sad.png')} />
                }

                <View style={{ flex: 1 }}>
                    <Text className="text-base ml-4">Goal: {item.goalWeight} kg</Text>
                    {/* Start Goal */}
                    <TouchableHighlight onPress={() => toggleExpand(index)} style={styles.toggle} underlayColor="#F7F7FB">
                        <View className="flex-row pl-1 pr-5" style={{ justifyContent: 'space-between' }}>
                            <View className="flex-row pr-6" style={{ justifyContent: 'space-between', flex: 1 }}>
                                <Text className="text-base ml-3">Start: {item.historyWeight[0].weight} kg</Text>
                                <Text style={{ color: 'darkgray' }} className="text-base">
                                    {item.historyWeight[0].date}
                                </Text>
                                {/* <Text className="text-base text-Darkgray">{item.startGoalDate}</Text> */}
                            </View>
                            <View>
                                {
                                    isExpanded ?
                                        <Ionicons name="md-chevron-up-outline" size={20} color="black" /> :
                                        <Ionicons name="md-chevron-down-outline" size={20} color="black" />
                                }
                            </View>
                        </View>
                    </TouchableHighlight>
                    {/* Progress Goal */}
                    {isExpanded && (
                        <ExpandableView expanded={isExpanded} item={item} />
                    )}
                    {/* End Goal */}
                    <View className="flex-row pl-1 pr-16" style={{ justifyContent: 'space-between' }}>
                        <Text className="text-base ml-3" style={{ color: item.historyWeight[item.historyWeight.length - 1].weight == item.goalWeight ? '#025146' : '#EC744A' }}>End:  {item.historyWeight[item.historyWeight.length - 1].weight} kg</Text>
                        <Text style={{ color: 'darkgray' }} className="text-base">
                            {item.historyWeight[item.historyWeight.length - 1].date}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const historySeparator = () => {
        return <View style={{ backgroundColor: '#A4A4A4', height: 1 }} />
    }

    //main screen
    return (
        <View style={styles.container}>
            {greenHeader(navigation)}
            <FlatList
                data={allGoal}
                renderItem={historyListPattern}
                ItemSeparatorComponent={historySeparator}
                keyExtractor={(item) => item.key}
                className="mt-4"
            />
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 0, }}>
                <TouchableOpacity style={styles.btnClearHistory}>
                    <Text className="font-bold text-white test-base" >Clear History</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        height: '100%'
    },
    header: {
        backgroundColor: '#025146',
        height: '18%',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: 100,
        width: '100%',
        paddingLeft: 20,
        flexDirection: 'row'
    },
    btnClearHistory: {
        backgroundColor: '#EC744A',
        padding: 10,
        marginTop: 30,
        borderRadius: 20,
        width: '40%',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 3
    },
    toggle: {
        height: 30,
        justifyContent: "center",
    },
})


export default HistoryScreen;