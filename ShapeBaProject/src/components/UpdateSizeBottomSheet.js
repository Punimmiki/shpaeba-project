import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import { BottomSheetModal } from "@gorhom/bottom-sheet";
// firebase
import { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, query, where } from '../../firebase-cofig'
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, setUserEmail, userSelector } from '../store/slice/userSlice'


const UpdateSizeBottomModal = (props) => {
    // props
    const bottomSheetModalRef = props.bottomSheetModalRef;

    //redux
    const userStore = useSelector(userSelector);
    const userId = userStore.userId

    // Bottom Sheet
    const snapPoints = ["40%"];
    const isOpen = props.isOpen;
    const closeModal = () => {
        bottomSheetModalRef.current?.close();
        setTimeout(() => {
            props.setIsOpen(false);
        }, 200);
        console.log("close modal")
    }

    // serving size textInput state
    const [updateServingSize, setUpdateServingSize] = useState()

    // ------------ edit menu handler ---------------
    const editMealHandler = async () => {
        const mealName = props.mealName
        console.log("Edit Menu id: ", props.editMenuInfo.name)
        try {
            const querySnapshot = query(collection(db, "dailyMeal"), where("user_id", "==", userId));
            const dailyMealRef = await getDocs(querySnapshot)

            dailyMealRef.forEach(async (doc) => {
                const currentMealData = doc.data()[mealName]
                const updateMealData = currentMealData.map((menu) => {
                    if (menu.id == props.editMenuInfo.id) {
                        return {...menu, serving_size_g: updateServingSize, calories: (menu.calories / menu.serving_size_g * updateServingSize).toFixed(2)}
                    }
                    return menu
                })

                const docRef = doc.ref
                await updateDoc(docRef, {
                    [mealName]: updateMealData
                })

                props.setIsEditMenu(true); // --> useFocuseEffect fetch update menu (in DetailMealScreen)
                closeModal()
                setUpdateServingSize(" ")
            })
        }
        catch(error) {
            console.log("delete meal error >> ", error)
        }
    }

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
                            props.editMenuInfo !== undefined
                            ? props.editMenuInfo.name
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
                            onChangeText={(text) => setUpdateServingSize(text)}
                            value={updateServingSize}
                        />
                        <Text className="text-base" style={{ justifyContent: 'flex-end' }}>g.</Text>
                    </View>

                    <View className="flex-row justify-center">
                        <TouchableOpacity className="bg-white" style={[styles.button, { marginRight: 25 }]} onPress={closeModal}>
                            <Text className="font-bold text-Orange text-lg">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-Orange" style={[styles.button, { marginLeft: 25 }]} onPress={() => editMealHandler()}>
                            <Text className="font-bold text-white text-lg">Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheetModal>
        </SafeAreaView>
        // </View>
    )
}

export default UpdateSizeBottomModal

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