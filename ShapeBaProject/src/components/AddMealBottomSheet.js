import React, { useEffect, useState } from 'react';
import {
    Modal, TouchableWithoutFeedback,
    StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, Alert
} from 'react-native';
import { BottomSheetModal } from "@gorhom/bottom-sheet";
// firebase
import { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, query, where } from '../../firebase-cofig'
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { getUserId, setUserEmail, userSelector } from '../store/slice/userSlice'

// ---------------------- Create Own Menu ---------------------------------
export const CreateMealBottomModal = (props) => { // TODO: เพิ่มช่องกรอกข้อมูล สารอาหาร
    //props
    const bottomSheetModalRef = props.bottomSheetModalRef;
    //redux
    const dispatch = useDispatch();
    const userStore = useSelector(userSelector);

    const snapPoints = ["60%",];
    const [name, setName] = useState("");
    const [cal, setCal] = useState("");
    const [size, setSize] = useState("");
    const [u_id, setU_id] = useState(userStore.userId);


    const isOpen = props.isOpen;
    const closeModal = () => {
        bottomSheetModalRef.current?.close();
        setTimeout(() => {
            props.setIsOpen(false);
        }, 200);
    }

    const handleModalDismiss = () => {
        bottomSheetModalRef.current?.dismiss();
    };

    //add my menu to firebase
    const saveMyMenu = async () => {
        console.log(name, cal, size)
        try {
            const docRef = await addDoc(collection(db, "myMenu"), {
                user_id: u_id,
                name: name,
                calories: cal,
                serving_size_g: size,
                carbohydrates_total_g: 0,
                fat_total_g: 0,
                protein_g: 0,
            });
            //refresh my menu UI
            props.getMyMenuById();
            closeModal();
            setCal("");
            setSize("");
            setName("");
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <SafeAreaView>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                backgroundStyle={{ borderRadius: 30, }}
                onDismiss={() => props.setIsOpen(false)}
            >
                <View className="p-8">
                    <Text className="text-xl mb-8 font-semibold">
                        Create My Menu
                    </Text>
                    <View className="bg-white p-3" style={[styles.textInput, styles.textInputCreate]}>
                        <Text className="text-base" style={{ justifyContent: 'flex-start' }}>Menu Name :</Text>
                        <TextInput
                            style={{ flex: 1 }}
                            className="h-15 pl-3 pr-3"
                            underlineColorAndroid="transparent"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View className="bg-white p-3 mt-3" style={[styles.textInput, styles.textInputCreate]}>
                        <Text className="text-base" style={{ justifyContent: 'flex-start' }}>Serving Size :</Text>
                        <TextInput
                            style={{ flex: 1 }}
                            className="h-15 pl-3 pr-3"
                            underlineColorAndroid="transparent"
                            keyboardType="number-pad"
                            value={size}
                            onChangeText={(text) => setSize(text)}
                        />
                        <Text className="text-base" style={{ justifyContent: 'flex-end' }}>g.</Text>
                    </View>
                    <View className="bg-white p-3 mt-3" style={[styles.textInput, styles.textInputCreate]}>
                        <Text className="text-base" style={{ justifyContent: 'flex-start' }}>Calories :</Text>
                        <TextInput
                            style={{ flex: 1 }}
                            className="h-15 pl-3 pr-3"
                            underlineColorAndroid="transparent"
                            keyboardType="number-pad"
                            value={cal}
                            onChangeText={(text) => setCal(text)}
                        />
                        <Text className="text-base" style={{ justifyContent: 'flex-end' }}>cals.</Text>
                    </View>

                    <View className="flex-row justify-center">
                        <TouchableOpacity className="bg-white" style={[styles.button, { marginRight: 25 }]} onPress={closeModal}>
                            <Text className="font-bold text-Orange text-lg">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-Orange" style={[styles.button, { marginLeft: 25 }]} onPress={saveMyMenu}>
                            <Text className="font-bold text-white text-lg">Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* </Background> */}
            </BottomSheetModal>
        </SafeAreaView>
    )
}
// ---------------------- Add Menu ---------------------------------
export const AddMealBottomModal = (props, { navigation }) => {
    // props
    const bottomSheetModalRef = props.bottomSheetModalRef;
    const { onTouchOutside, title } = props
    //redux
    const userStore = useSelector(userSelector);
    // console.log(">>>>>> ", props.selectedMenu)
    // Bottom Sheet
    const snapPoints = ["40%"];
    const isOpen = props.isOpen;
    // console.log("add meal bottom sheet: ", isOpen)
    const closeModal = () => {
        // if (props.isAddedMenu) {
        //     navigation.navigate('DetailMealScreen')
        // }
        bottomSheetModalRef.current?.close();
        setTimeout(() => {
            props.setIsOpen(false);
        }, 200);
        console.log("close modal")
    }

    // serving size textInput state
    const [servingSize, setServingSize] = useState()

    // ********************************* add selected menu to database ****************************************
    const handleAddMenu = async () => { // TODO: >>> แก้ bottom sheet ถ้ายังไม่ใส่ serving size กด Add meal ไม่ได้ !!

        // -------------------------- get current date ---------------------
        const getDate = new Date()
        const day = getDate.getDate()
        const month = getDate.getMonth() + 1 // (Month will start at 0)
        const year = getDate.getFullYear()

        const dayOfWeek = getDate.getDay() // [0, 1, ..., 6]
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const dayName = daysOfWeek[dayOfWeek] // get name of week

        const currentDate = `${day}/${month}/${year}`
        // ------------------------------------------------------------------

        try {
            const userId = await getUserId()
            console.log("add menu", userId)
            const mealName = (props.mealName.split(" ").join("")).toLowerCase();
            const dailyMealRef = query(collection(db, "dailyMeal"), where("user_id", "==", userId));

            const getDailyMealsDoc = await getDocs(dailyMealRef) // get doc where userId == ...

            const mealData = { // data that will add to database (Calculate with serving size)
                id: ((Math.random() * (1 - 0) + 0) * 100 + "").substr(3, 12) + props.selectedMenu.name,
                name: props.selectedMenu.name,
                serving_size_g: parseFloat(servingSize),
                calories: (props.selectedMenu.calories / props.selectedMenu.serving_size_g * servingSize).toFixed(2),
                protein_g: (props.selectedMenu.protein_g / props.selectedMenu.serving_size_g * servingSize).toFixed(2),
                carbohydrates_total_g: (props.selectedMenu.carbohydrates_total_g / props.selectedMenu.serving_size_g * servingSize).toFixed(2),
                fat_total_g: (props.selectedMenu.fat_total_g / props.selectedMenu.serving_size_g * servingSize).toFixed(2)
            }

            // ----------- format date data string to dd/mm/yyyy -----------
            function convertDateFromString(dateString) {
                const [day, month, year] = dateString.split('/').map(Number);
                return new Date(year, month - 1, day);
            }

            function formatDateToDdMmYyyy(dateString) {
                const date = new Date(dateString);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                const formattedDay = day.toString().padStart(2, '0');
                const formattedMonth = month.toString().padStart(2, '0');

                return `${formattedDay}/${formattedMonth}/${year}`;
            }
            // ------------------------------------------------------------

            // function add meal data for else case
            async function addMealDoc() {
                const mealsName = ['breakfast', 'brunch', 'lunch', 'afternoonlunch', 'dinner', 'afterdinner']
                const newMealDoc = {
                    user_id: userId , // FIXME: change to real user id
                    dateInfo: {
                        date: currentDate,
                        dayOfWeek: dayName
                    },
                    [mealName]: [mealData]
                }

                // filter meal that not be add
                const missingMeals = mealsName.filter(meal => meal != mealName)
                missingMeals.forEach(meal => {
                    newMealDoc[meal] = []
                })

                try {
                    const newMealDocRef = await addDoc(collection(db, "dailyMeal"), newMealDoc);
                    console.log("<<< ADD MEAL SUCCESS >>>")
                }
                catch (error) {
                    console.error("ADD MEAL DOCUMENT FAIL >>> ", error);
                }
            }


            ///////////// CASE 1 user already has meal on the current date //////////////
            if (!getDailyMealsDoc.empty) {
                console.log("case 1")
                let foundMatch = false;

                for (const doc of getDailyMealsDoc.docs) {
                    const dailyMealData = doc.data() // ข้อมูลมื้ออาหารของแต่ละ document
                    const mealArray = dailyMealData[mealName] || [] // เก็บอาหารใน Array ตามมื้อที่เลือกไว้

                    const dateString = doc.data().dateInfo.date
                    const dateFromDatabase = formatDateToDdMmYyyy(convertDateFromString(dateString)) // change date format

                    // compare current date to date from database if equal >> already has document >> push meal array
                    if (currentDate === dateFromDatabase) {
                        console.log("case 1.1")
                        mealArray.push(mealData)

                        const updateMeal = { [mealName]: mealArray }
                        await updateDoc(doc.ref, updateMeal)
                            .then(() => {
                                console.log("<<< ADD MEAL SUCCESS >>>");
                            })
                            .catch((error) => {
                                console.error("ADD MEAL FAIL >>> ", error);
                            });

                        foundMatch = true
                    }
                }

                if (!foundMatch) {
                    console.log("case 1.2")
                    await addMealDoc()
                }

            }

            //////////// CASE 2 user has not meal on the current date >> add document ///////////
            else {
                console.log("case 2")
                await addMealDoc()
            }
        }
        catch (error) {
            console.log(error)
        }
        setServingSize("")
        closeModal()
        props.setIsAddedMenu(true)
    }
    // *************************************************************************************************************

    return (
        <SafeAreaView>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints} s
                backgroundStyle={{ borderRadius: 30, marginBottom: 0 }}
                animationType={'fade'}
            // onDismiss={() => props.setIsOpen(false)}
            >

                <View className="p-8">
                    <Text className="text-xl mb-8 font-semibold">
                        {
                            props.selectedMenu !== undefined
                                ? props.selectedMenu.name
                                : ""
                        }
                    </Text>
                    <View className="bg-white p-3" style={styles.textInput}>
                        <Text className="text-base" style={{ justifyContent: 'flex-start' }}>Serving Size :</Text>
                        <TextInput
                            style={{ flex: 1 }}
                            className="h-15 pl-3 pr-3"
                            underlineColorAndroid="transparent"
                            keyboardType="number-pad"
                            onChangeText={(text) => setServingSize(text)}
                            value={servingSize}
                        />
                        <Text className="text-base" style={{ justifyContent: 'flex-end' }}>g.</Text>
                    </View>

                    <View className="flex-row justify-center">
                        <TouchableOpacity className="bg-white" style={[styles.button, { marginRight: 25 }]} onPress={closeModal}>
                            <Text className="font-bold text-Orange text-lg">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-Orange" style={[styles.button, { marginLeft: 25 }]} onPress={() => handleAddMenu()}>
                            <Text className="font-bold text-white text-lg">Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheetModal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "gray",
        alignItems: "center",
    },
    contentContainer: {
        flex: 1,
        width: "100%",

    },
    title: {
        fontWeight: "900",
        letterSpacing: 0.5,
        fontSize: 16,
        color: "white",
    },
    button: {
        padding: 5,
        marginTop: 30,
        borderRadius: 30,
        width: '40%',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 3,
        underlineColorAndroid: "transparent",
    },
    textInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBlockColor: '#4B4B4B',
    },
});
