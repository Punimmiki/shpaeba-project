import { StyleSheet, View, Text, FlatList, Modal, Pressable, TouchableHighlight, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from "react";

// segmant tab
import SegmentedControlTab from "react-native-segmented-control-tab";
// renderItemSeparator
import { renderItemSeparator } from '../screens/Meal/DetailMealsScreen'
// Swipeable
import SwipeableFlatList from 'react-native-swipeable-list';
// Icon
import { FontAwesome, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';
// Bottom Modal
import { AddMealBottomModal, CreateMealBottomModal } from './AddMealBottomSheet';
import UpdateBottomSheet from './UpdateBottomSheet';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { addMealSelector } from '../store/slice/mealsSlice';
import { setMenus, delMenu, setEditMenu } from '../store/slice/mealsSlice';
// Database
import { db, collection, getDocs, query, where, deleteDoc, doc, updateDoc } from '../../firebase-cofig'
import { useFocusEffect } from "@react-navigation/native";
import { setUserId, setUserEmail, userSelector } from '../store/slice/userSlice';


// Segment เปลี่ยนหน้า
const AddMealsSegment = (props) => {
    // for Redux
    const dispatch = useDispatch()
    const userStore = useSelector(userSelector);
    const allMenusStore = useSelector(addMealSelector)
    const allMenus = allMenusStore.allMenus


    const [u_id, setU_id] = useState(userStore.userId);
    const [myMenu, setMyMenu] = useState([]);

    // ------------------------- Get My Menu by User ID ------------------------------------------
    const getMyMenuById = async () => { // Pass the user ID as an argument
        if (search) {
            await searchMenuInDatabase()
            return
        }
        else if (search == false) {
            try {
                const querySnapshot = await getDocs(query(collection(db, "myMenu"), where("user_id", "==", u_id))); // Use the user's ID passed as an argument
                console.log("Total menu: ", querySnapshot.size);
                const tempDoc = [];
                querySnapshot.forEach((doc) => {
                    tempDoc.push({ ...doc.data(), key: doc.id });
                });
                setMyMenu(tempDoc);

            } catch (error) {
                console.error("Error fetching user menu: ", error);
            }
        }

    }
    // ---------------------------------------------------------------------------------

    // search props from header
    const search = props.search

    // check if added menu in meal
    const [isAddedMenu, setIsAddedMenu] = useState(false)

    // ----------------------- Search MyMenu from Database ----------------------------- 
    const searchMenuInDatabase = async () => {
        console.log("allMenus dispatch", allMenus)
        try {
            console.log("... finding menu in database")
            const querySnapshot = query(collection(db, "myMenu"),
                where("user_id", "==", userStore.userId),
                where("name", "==", props.searchInput))

            const myMenuDocs = await getDocs(querySnapshot)
            const tempDoc = []

            myMenuDocs.forEach((doc) => {
                if (doc.data().name == props.searchInput) {
                    tempDoc.push({ ...doc.data(), key: doc.id })
                }
            })

            return tempDoc.length > 0 ? setMyMenu(tempDoc) : setMyMenu([])
            // tempDoc.length > 0 ? setDataFromDatabase(tempDoc) : dispatch(delMenu())
        }
        catch (error) {
            console.error("Error occurred while searching the database:", error);
        }

    }

    // ----------------------------- Search Menu From Nutrition API -----------------------------
    const apiSearch = async () => {
        if (search != "") {
            fetch('https://api.api-ninjas.com/v1/nutrition?query=' + search, {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'wIvbYEMaum9wtqjsPbj5ZA==ABsp5fb3TdHYbd0m',
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then((result) => {
                    dispatch(setMenus(result))
                })
                .catch((error) => {
                    console.log("not found menu in API !")
                });
        }
        else {
            dispatch(delMenu())
        }
    }
    // -----------------------------------------------------------------


    // select segment
    // selectedIndex = 0 => AllMenu, selectedIndex = 1 => MyMenu,  
    const [selectedIndex, setSelectIndex] = useState(0)

    // add meal bottom sheet
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const bottomSheetModalRefAdd = useRef(null);

    // create own menu bottom sheet
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const bottomSheetModalRefCreate = useRef(null);

    const [selectedMenu, setSelectMenu] = useState()

    // update own menu bottom sheet
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const bottomSheetModalRefUpdate = useRef(null);

    //open bottom sheet
    const handlePresentModalAdd = (menuData) => {
        setSelectMenu(menuData)
        bottomSheetModalRefAdd.current?.present();
        setTimeout(() => {
            setIsOpenAdd(true);
        }, 100);
    }
    const handlePresentModalCreate = () => {
        console.log(isOpenCreate)
        bottomSheetModalRefCreate.current?.present();
        setTimeout(() => {
            setIsOpenCreate(true);
        }, 100);
    }
    const handlePresentModalUpdate = () => {
        console.log(isOpenCreate)
        bottomSheetModalRefUpdate.current?.present();
        setTimeout(() => {
            setIsOpenUpdate(true);
        }, 100);
    }

    const handleIndexChange = (index) => {
        setSelectIndex(index)
    }
    const renderData = ({ item }) => {
        return (
            <>
                <TouchableHighlight
                    style={styles.touchable}
                    underlayColor="#F7F7FB"
                    onPress={() => {
                        handlePresentModalAdd(item)
                    }}
                >
                    <View className="flex-row justify-between p-3 items-center">
                        <View className="pl-1">
                            <Text className="text-base font-semibold" style={{ flex: 1 }}>{item.name}</Text>
                            <Text className=" text-xs pt-1">{item.serving_size_g} g, {item.calories} cals</Text>
                        </View>
                        <AntDesign name="plus" size={15} color="black" style={{ paddingRight: 10 }} />
                    </View>
                </TouchableHighlight>
            </>
        )
    }

    //swipe menu
    const [menuInfo, setMenuInfo] = useState({})
    const QuickActions = (index, item) => {
        // console.log("index: ", index)
        const deleteMenu = (val, index) => {
            setMenuInfo(val)
            console.log("delete menu: ", menuInfo, index)
            dbDeleteMenu()
        }
        const updateMenu = (val) => {
            console.log("menuInfo: ", val)
            setMenuInfo(val)
            handlePresentModalUpdate()
        }
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }}>
                <View style={[styles.button, { backgroundColor: '#EF5353' }]}>
                    <Pressable onPress={() => deleteMenu(item, index)}>
                        <FontAwesome name="trash-o" size={28} color="white" />
                    </Pressable>
                </View>
                <View style={[styles.button, { backgroundColor: '#FBBB57' }]}>
                    <Pressable onPress={() => updateMenu(item)}>
                        <Feather name="edit" size={24} color="white" />
                    </Pressable>
                </View>
            </View>
        );
    };

    //delete menu
    const dbDeleteMenu = async () => {
        try {
            console.log("delete done: ", menuInfo.key)
            await deleteDoc(doc(db, "myMenu", menuInfo.key));
            getMyMenuById();
            console.log("Success", "Menu deleted successfully");

        } catch (e) {
            console.log("Error", "Error deleting document: " + e.message);
        }
    }


    const handleFocusEffectForSegment0 = () => {
        console.log("---- in segment 0")
        console.log("___________API Search")
        apiSearch();
        return () => {
            dispatch(delMenu());
            props.setBtnSearch(false);
        }
    }

    const handleFocusEffectForSegment1 = () => {
        console.log("---- in segment 1")
        console.log("___________Database Search")
        getMyMenuById()
        return () => {
            setMyMenu([])
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if (selectedIndex === 0) {
                return handleFocusEffectForSegment0()
            }
            if (selectedIndex === 1) {
                return handleFocusEffectForSegment1()
            }
        }, [search, selectedIndex])
    )


    return (
        <View style={{ flex: 1, alignItems: 'center', width: '100%', marginBottom: 20, paddingTop: 30 }}>
            <SegmentedControlTab
                tabsContainerStyle={{ width: '80%', borderRadius: 30, overflow: 'hidden', marginBottom: 30 }}
                tabStyle={{ borderWidth: 0, backgroundColor: '#F7F7FB' }}
                firstTabStyle={{ marginRight: 5, borderRadius: 30, borderColor: 'white' }}
                lastTabStyle={{ marginLeft: 5, borderRadius: 30, borderColor: 'white' }}
                tabTextStyle={{ color: '#EC744A', fontWeight: 'bold' }}
                activeTabStyle={{ backgroundColor: '#EC744A' }}
                selectedIndex={selectedIndex}
                allowFontScaling={false}
                values={["All", "My Menu"]}
                onTabPress={handleIndexChange}
            />
            {/* เงื่อนไขแสดงหน้า All menu หรือ My menu */}
            {
                selectedIndex === 0 ?
                    // All
                    <FlatList
                        style={{ padding: 40, paddingTop: 5, width: '100%' }}
                        // data={allMeals}
                        data={allMenus}
                        renderItem={renderData}
                        keyExtractor={item => item.name}
                        ItemSeparatorComponent={renderItemSeparator}
                    /> :
                    // My Menu
                    <View style={{ width: '100%', height: '100%' }}>
                        <SwipeableFlatList
                            keyExtractor={(item) => item.key}
                            data={myMenu}
                            renderItem={renderData}
                            maxSwipeDistance={240}
                            renderQuickActions={({ index, item }) => QuickActions(index, item)}
                            contentContainerStyle={{ padding: 40, paddingTop: 5, width: '100%' }}
                            shouldBounceOnMount={false}
                            ItemSeparatorComponent={renderItemSeparator}
                            onSwipeableOpen={false}
                        />
                        {/* Add My Menu Button */}
                        <TouchableHighlight
                            className="absolute bottom-20 right-8 bg-Orange w-14 h-14 rounded-full justify-center items-center elevation-3"
                            style={{ elevation: 3 }}
                            underlayColor="#EF8E6D"
                            onPress={handlePresentModalCreate}
                        >
                            <FontAwesome5 name="plus" size={20} color="white" />
                        </TouchableHighlight>
                    </View>
            }
            <AddMealBottomModal isAddedMenu={isAddedMenu} setIsAddedMenu={setIsAddedMenu} isOpen={isOpenAdd} setIsOpen={setIsOpenAdd} bottomSheetModalRef={bottomSheetModalRefAdd} selectedMenu={selectedMenu} mealName={props.mealName} />
            <CreateMealBottomModal isOpen={isOpenCreate} setIsOpen={setIsOpenCreate} bottomSheetModalRef={bottomSheetModalRefCreate} getMyMenuById={getMyMenuById} />
            <UpdateBottomSheet isOpen={isOpenUpdate} setIsOpen={setIsOpenUpdate} bottomSheetModalRef={bottomSheetModalRefUpdate} menuInfo={menuInfo} setMenuInfo={setMenuInfo} getMyMenuById={getMyMenuById} />
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchable: {
        backgroundColor: 'white'
    }
});

export default AddMealsSegment;