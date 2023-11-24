import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import { Header } from 'react-native-elements';
import { AntDesign, Entypo } from '@expo/vector-icons';
import SwipeableFlatList from 'react-native-swipeable-list';
import { FontAwesome, Feather } from '@expo/vector-icons';
import React, { useState, useRef } from 'react'
import { useFocusEffect } from "@react-navigation/native";

// Bottom Sheet
import UpdateSizeBottomModal from '../../components/UpdateSizeBottomSheet';

// Firebase
import { db, collection, getDocs, query, where, deleteDoc, doc, updateDoc } from '../../../firebase-cofig'
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, setUserEmail, userSelector } from '../../store/slice/userSlice';


const greenHeader = (navigation, mealName, sumCalories) => {
    return (
        <Header backgroundColor="#025146" containerStyle={styles.header}
            leftComponent={
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginRight: 15, marginTop: 3 }} onPress={() => navigation.goBack()}>
                        <AntDesign name="leftcircleo" size={25} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20, width: '200%', fontWeight: 'bold' }}>{mealName}</Text>
                </View>
            }
            // centerComponent={{icon: 'menu', color: '#fff', iconStyle: {color: 'white', paddingLeft: 90, marginTop: 5}}}
            rightComponent={
                <View style={{ flexDirection: 'row', marginLeft: -15}}>
                    <View style={{ marginRight: 3, marginTop: 3 }}>
                        <Entypo name="flash" size={22} color="white" />
                    </View>
                    <Text style={{ color: 'white', fontSize: 20, width: '150%', fontWeight: 'bold' }}>{sumCalories} cals</Text>
                </View>
            }
        >
        </Header>
    )
}

// renderItem
export const DetailMealsPattern = ({ item }) => {
    return (
        <>
            <View style={{ paddingLeft: 10, backgroundColor: 'white' }}>
                <Text className="font-semibold mt-3 text-base">{item.name}</Text>
                <Text className="mb-3">{item.serving_size_g} g , {item.calories} cals</Text>
            </View>
        </>
    )
}

// separator
export function renderItemSeparator() {
    return <View style={{ backgroundColor: '#A4A4A4', height: 1 }} />;
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Main Component >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const DetailMealsScreen = ({ navigation, route }) => {
    // selected meal
    const mealName = (route.params.header.split(" ").join("")).toLowerCase()

    // reduct store
    const userStore = useSelector(userSelector);
    const userId = userStore.userId

    // ------ edit serving size meal bottom sheet -------
    const [isOpen, setIsOpen] = useState(false);
    const bottomSheetModalRef = useRef(null);
    const [editMenuInfo, setEditMenuInfo] = useState()

    const bottomSheetEditHandler = (editMenuData) => {
        setIsEditMenu(false)
        setEditMenuInfo(editMenuData)
        bottomSheetModalRef.current?.present();
        setTimeout(() => {
            setIsOpen(true);
        }, 100);
    }

    // ------------ delete menu handler ---------------
    const daleteMealHandler = async (deleteMenuId) => {
        console.log("Deleted Menu id: ", deleteMenuId)
        try {
            const querySnapshot = query(collection(db, "dailyMeal"), where("user_id", "==", userId));
            const dailyMealRef = await getDocs(querySnapshot)

            dailyMealRef.forEach(async (doc) => {
                const updateMeal = doc.data()[mealName].filter(menu => menu.id !== deleteMenuId)
                const docRef = doc.ref;
                await updateDoc(docRef, {
                    [mealName]: updateMeal
                })
            })
            getmealData()
        }
        catch (error) {
            console.log("delete meal error >> ", error)
        }
    }


    // item in swipe
    const QuickActions = (index, item) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }}>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#EF5353' }]}>
                    <Pressable onPress={() => daleteMealHandler(item.id)}>
                        <FontAwesome name="trash-o" size={28} color="white" />
                    </Pressable>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { backgroundColor: '#FBBB57' }]}>
                    <Pressable onPress={() => bottomSheetEditHandler(item)}>
                        <Feather name="edit" size={24} color="white" />
                    </Pressable>
                </TouchableOpacity>
            </View>
        );
    };

    // --------------------------- set meal data from database ---------------------------------
    const [mealData, setMealData] = useState([])

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Note: Months are zero-based, so we add 1 to get the correct month.
    const year = currentDate.getFullYear();

    const today = `${day}/${month}/${year}`;

    const [sumCalories, setSumCalories] = useState(0)

    // check state edit menu
    const [isEditMenu, setIsEditMenu] = useState(false)

    // show menu in meal
    const getmealData = async () => {
        let plusCal = 0
        try {
            const querysnapshot = query(collection(db, "dailyMeal")
                , where("user_id", "==", userId)
                , where("dateInfo.date", "==", today))
            const filterMealDocs = await getDocs(querysnapshot)

            const tempDoc = []
            filterMealDocs.forEach((doc) => {
                const menuInSelectedMeal = doc.data()[mealName]
                // if (menuInSelectedMeal.length == 0) { // TODO: >> (show sth. if not found data)
                //     console.log("< NOT FOUND DATA >")
                // }
                menuInSelectedMeal.forEach((menu) => {
                    plusCal += parseFloat(menu.calories)
                    console.log("+ each menu cals: ", menu.calories)
                    tempDoc.push({ ...menu, key: menu.id })
                })
                setSumCalories(plusCal)
            });

            setMealData(tempDoc)
        }
        catch (error) {
            console.error("Error get meal data: ", error)
        }

    }


    useFocusEffect(
        React.useCallback(() => {
            console.log("screen: ", mealName)
            console.log(((Math.random() * (1 - 0) + 0) * 100 + "").substr(3, 12))
            getmealData();
            return () => {
                // Clear the meal state when the component is unfocused
                setMealData([]);
            };
        }, [isEditMenu])
    );
    // ----------------------------------------------------------------------------------------

    return (
        <View style={styles.container}>
            {greenHeader(navigation, route.params.header, sumCalories.toFixed(2))}
            <SwipeableFlatList
                keyExtractor={(item) => item.key}
                data={mealData}
                renderItem={({ item }) => (
                    <DetailMealsPattern item={item} />
                )}
                maxSwipeDistance={240}
                renderQuickActions={({ index, item }) => QuickActions(index, item)}
                contentContainerStyle={{ paddingLeft: 30, paddingRight: 30, paddingTop: 15 }}
                shouldBounceOnMount={false}
                ItemSeparatorComponent={renderItemSeparator}
                onSwipeableOpen={false}
            />
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 0, }}>
                <TouchableOpacity style={styles.btnAddMeal} onPress={() => navigation.navigate('AddMealsScreen', { mealName: route.params.header })}>
                    <Text className="font-bold text-white" >Add More Meal</Text>
                </TouchableOpacity>
            </View>
            <UpdateSizeBottomModal setIsEditMenu={setIsEditMenu} mealName={mealName} editMenuInfo={editMenuInfo} isOpen={isOpen} setIsOpen={setIsOpen} bottomSheetModalRef={bottomSheetModalRef} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
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
    btnAddMeal: {
        backgroundColor: '#EC744A',
        padding: 10,
        marginTop: 30,
        borderRadius: 20,
        width: '50%',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 3
    },
    button: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default DetailMealsScreen;