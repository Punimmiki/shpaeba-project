
import { StatusBar } from "expo-status-bar";
import {
    Button,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    useWindowDimensions,
    View,
    SafeAreaView,
    TouchableOpacity,
    TouchableHighlight
} from "react-native";
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";




const MealBottomSheet = (props) => {
    const [darkmode, setDarkmode] = useState(false);
    const [device, setDevice] = useState(false);
    const { width } = useWindowDimensions();
    const [theme, setTheme] = useState("dim");
    //props
    const bottomSheetModalRef = props.bottomSheetModalRef;
    const isOpen = props.isOpen;

    const snapPoints = ["25%", "60%",];
    // console.log("isOpen", isOpen)

    const chooseMeal = (title) => {
        // console.log(title)
        props.setTitleMeal(title)
    }
    const mealMenu = (title) => {
        return (
            <>
                <TouchableOpacity className="flex-row p-4" onPress={() => chooseMeal(title)}>
                    <View className="flex-row gap-6 pl-3">
                        <Text className="font-medium text-base text-Darkgray">{title} </Text>
                    </View>
                </TouchableOpacity>
                <View className="border-b  border-Darkgray opacity-20" />

            </>
        );
    }



    return (
        <SafeAreaView style={styles.container}>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                backgroundStyle={{ borderRadius: 30, backgroundColor: "#025146" }}
                onDismiss={() => props.setIsOpen(false)}
            >
                <View style={styles.contentContainer}>
                    <Text style={[styles.title, { marginBottom: 10, marginLeft: 20 }]}>
                        Select Meal
                    </Text>
                    <View className="bg-white rounded-3xl h-full">
                        {mealMenu("Breakfast")}
                        {mealMenu("Bunch")}
                        {mealMenu("Lunch")}
                        {mealMenu("Afternoon Lunch")}
                        {mealMenu("Dinner")}
                        {mealMenu("After Dinner")}
                        <View className="bg-white w-full -mt-3">
                            <TouchableOpacity className="bg-Orange" style={[styles.button, { marginRight: 25 }]} onPress={props.closeModal}>
                                <Text className="font-bold text-white text-lg">Cancel</Text>
                            </TouchableOpacity>
                        </View>

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
        // justifyContent: "center",
    },
    contentContainer: {
        flex: 1,
        width: "100 %",

    },
    row: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    title: {
        fontWeight: "900",
        letterSpacing: 0.5,
        fontSize: 16,
        color: "white",
    },
    subtitle: {
        color: "#025146",
        fontSize: 14,
        fontWeight: "bold",
    },
    description: {
        color: "#56636F",
        fontSize: 13,
        fontWeight: "normal",
        width: "100%",
    },
    button: {
        padding: 5,
        marginTop: 10,
        borderRadius: 30,
        width: '30%',
        alignItems: 'center',
        elevation: 3,
        underlineColorAndroid: "transparent",
        alignSelf: "flex-end"
    },
});

export default MealBottomSheet