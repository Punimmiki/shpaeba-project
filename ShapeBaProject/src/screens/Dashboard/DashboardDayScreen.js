import { StatusBar } from 'expo-status-bar';
import { Easing, runTiming, useFont, useValue } from "@shopify/react-native-skia";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, PixelRatio, TouchableHighlight } from 'react-native';
import { Button } from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5 } from '@expo/vector-icons';
import {
    Canvas,
    Path,
    SkFont,
    Skia,
    SkiaMutableValue,
    // Text,
} from "@shopify/react-native-skia";
//component
import DonutChart from "../../components/DonutChart";
import React, { useState, useRef, useEffect } from 'react';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import TapToStart from '../ProcessInfo/TapToStart';
import BottomSheet from '../../components/MealBottomSheet';
import SumCalendar from '../../components/SumCalendar';
import DatePicker from 'react-native-modern-datepicker';
import { getFormatedDate } from "react-native-modern-datepicker";

//redux
import { useDispatch, useSelector } from 'react-redux';
import { frontEndSelector, setOpenStartDatePicker } from '../../store/slice/frontEndSlice';
import { userSelector, getUserId } from '../../store/slice/userSlice'
import { processInfoSelector, getGoalById } from '../../store/slice/processInfoSlice1';
//firebase
import { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, where, } from '../../../firebase-cofig';
import { set } from 'react-hook-form';


const listMeal = (icon, meal, cal, navigation) => {
    return (
        <TouchableOpacity className="flex-row justify-between" onPress={() => navigation.navigate('DetailMealsScreen', { header: meal })}>
            <View className="flex-row gap-5 pl-3 items-center">
                <Image source={icon}
                    style={{ width: 40, height: 40 }} />
                <Text className="font-medium text-base text-Darkgray">{meal}</Text>
            </View>
            <Text className="font-medium text-base text-Darkgray mr-4 mt-2">{cal} cals</Text>
        </TouchableOpacity>
    )
}
//for Donut Chart
const radius = PixelRatio.roundToNearestPixel(80);
const STROKE_WIDTH = 6;

//main
const DashboardDayScreen = ({ navigation }) => {
    // const targetPercentage = 50 / 100;
    const [targetPercentage, setTargetPercentage] = useState(0)
    const animationState = useValue(0);
    //for BottomSheet
    const [isOpen, setIsOpen] = useState(false);
    const bottomSheetModalRef = useRef(null);
    const [titleMeal, setTitleMeal] = useState("");
    //get data from redux
    const dispatch = useDispatch();
    const frontEndStore = useSelector(frontEndSelector);

    const [renderItem, setRenderItem] = useState(false)

    const [carb, setCarb] = useState(0);
    const [fat, setFat] = useState(0);
    const [protein, setProtein] = useState(0);
    const [cal, setCal] = useState(0);

    const [breakfast, setBreakfast] = useState({});
    const [brunch, setBrunch] = useState({});
    const [lunch, setLunch] = useState({});
    const [afternoonlunch, setAfternoonlunch] = useState({});
    const [dinner, setDinner] = useState({});
    const [afterdinner, setAfterdinner] = useState({});


    //for donut chart
    const innerRadius = radius - STROKE_WIDTH / 2;
    const targetText = `${targetPercentage * 100}`;
    // console.log("targetPercentage", targetPercentage)



    //for DatePicker
    const openStartDatePicker = frontEndStore.openStartDatePicker;
    const handleOnPressStartDate = (date) => {
        dispatch(setOpenStartDatePicker(!openStartDatePicker));
        navigation.navigate('SummaryScreen', { selectDate: date })
    };

    if (titleMeal != "") {
        //close modal
        bottomSheetModalRef.current?.close();
        setTimeout(() => {
            setIsOpen(false);
        }, 200);
        setTitleMeal("")
        navigation.navigate('DetailMealsScreen', { header: titleMeal })
    }


    // Get Daily meal by User ID
    const getDailyMenuById = async () => { // Pass the user ID as an argument
        try {
            const userId = await getUserId()
            const currentDate = new Date();
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Note: Months are zero-based, so we add 1 to get the correct month.
            const year = currentDate.getFullYear();
            const today = `${day}/${month}/${year}`;
            console.log("get daily menu", userId)

            const querySnapshot = await getDocs(query(collection(db, "dailyMeal"), where("user_id", "==", userId), where("dateInfo.date", "==", today))); // Use the user's ID passed as an argument
            console.log("Total menu: ", querySnapshot.size);
            const tempDoc = [];
            querySnapshot.forEach((doc) => {
                tempDoc.push({ ...doc.data(), key: doc.id });
            });
            console.log("tempdoc ", tempDoc)
            // Flatten the array if each category is an array of meals
            const meals1 = tempDoc.map((day) => day["breakfast"]);
            const meals2 = tempDoc.map((day) => day["brunch"]);
            const meals3 = tempDoc.map((day) => day["lunch"]);
            const meals4 = tempDoc.map((day) => day["afternoonlunch"]);
            const meals5 = tempDoc.map((day) => day["dinner"]);
            const meals6 = tempDoc.map((day) => day["afterdinner"]);
            setBreakfast(await extractNutrition(meals1.flat()))
            setBrunch(await extractNutrition(meals2.flat()))
            setLunch(await extractNutrition(meals3.flat()))
            setAfternoonlunch(await extractNutrition(meals4.flat()))
            setDinner(await extractNutrition(meals5.flat()))
            setAfterdinner(await extractNutrition(meals6.flat()))
            //trigger re-render
            setRenderItem(true)


        } catch (error) {
            console.error("Error fetching user menu: ", error);
        }

    }

    const chartInfo = async () => {
        //for chart
        if (!breakfast.carbohydrates) return;
        setCal(Number(breakfast.calories + brunch.calories + lunch.calories + afternoonlunch.calories + dinner.calories + afterdinner.calories).toFixed(0))
        setCarb(Number(breakfast.carbohydrates + brunch.carbohydrates + lunch.carbohydrates + afternoonlunch.carbohydrates + dinner.carbohydrates + afterdinner.carbohydrates).toFixed(1))
        setFat(Number(breakfast.fat + brunch.fat + lunch.fat + afternoonlunch.fat + dinner.fat + afterdinner.fat).toFixed(1))
        setProtein(Number(breakfast.protein + brunch.protein + lunch.protein + afternoonlunch.protein + dinner.protein + afterdinner.protein).toFixed(1))
        console.log("carb", carb, typeof carb)
        console.log("breakfase", breakfast, typeof breakfast.carbohydrates)
        //for donut chart
        const calChart = cal / (tdee / 100)
        setTargetPercentage(calChart / 100)
        console.log("--------total cal", cal)
        // setRenderItem(true)
    }

    const extractNutrition = async (meal) => {
        //calculate total nutrition & calories
        const totalNutrition = meal.reduce((acc, food) => {
            if (!food) return acc;
            // Convert the values to numbers for calculations
            const calories = parseFloat(food.calories);
            const fat = parseFloat(food.fat_total_g);
            const protein = parseFloat(food.protein_g);
            const carbohydrates = parseFloat(food.carbohydrates_total_g);

            // Sum the values
            acc.calories += calories;
            acc.fat += fat;
            acc.protein += protein;
            acc.carbohydrates += carbohydrates;

            return acc;
        }, { calories: 0, fat: 0, protein: 0, carbohydrates: 0 });
        // console.log("Total Nutrition:", totalNutrition);
        return totalNutrition;
    }

    const [tdee, setTdee] = useState(0)

    const fetchData = async () => {
        try {
            const getUserGoal = await getGoalById()
            setTdee(getUserGoal[0].TDEE);
            console.log("tdee", tdee)
        }
        catch (error) {
            console.log("ERROR FETCH DATA")
        }
    }

    const path = Skia.Path.Make();
    path.addCircle(radius, radius, innerRadius);

    animationState.current = 0;
    runTiming(animationState, targetPercentage, {
        duration: 1250,
        easing: Easing.inOut(Easing.cubic),
    });



    useFocusEffect(
        React.useCallback(() => {
            fetchData()
            getDailyMenuById();
            // if (breakfast.carbohydrates) {
            console.log("--------breakfast:", breakfast.carbohydrates);
            chartInfo();
            // }
        }, [renderItem, cal, carb, fat, protein])
    );

    const font = useFont(require("../../../assets/font/Roboto-Bold.ttf"), 20);
    const smallerFont = useFont(require("../../../assets/font/Roboto-Bold.ttf"), 20);

    if (!font || !smallerFont) {
        return <View />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ScrollView >
                <View style={
                    styles.container}>
                    <View style={openStartDatePicker ? styles.blur : null}></View>
                    <SumCalendar openStartDatePicker={openStartDatePicker} handleOnPressStartDate={handleOnPressStartDate} />

                    <View style={[styles.content, styles.c1]}>
                        <View style={styles.ringChartContainer}>
                            {/* donut chart */}
                            {/* {breakfast.carbohydrates ? ( */}
                            <Canvas style={styles.container1}>
                                <Path
                                    path={path}
                                    color="#EC744A"
                                    style="stroke"
                                    strokeJoin="round"
                                    strokeWidth={STROKE_WIDTH}
                                    strokeCap="round"
                                    start={0}
                                    end={animationState}
                                />

                            </Canvas>
                            {/* ) : null} */}

                            <View style={styles.innerCircle}>
                                <Text className="text-xl font-bold text-white text-center">{cal} /{tdee} </Text>
                                <Text className="text-sm font-medium text-white text-center">calories</Text>
                            </View>

                        </View>

                        <View style={styles.progress}>
                            <View>
                                <Text className="text-white text-[10px] pb-1" >{carb} g</Text>
                                <ProgressBar progress={carb / 200} color={"#EC744A"} className="h-1 rounded" />
                                <Text className="text-white text-[10px] pt-1" >Carb</Text>
                            </View>
                            <View>
                                <Text className="text-white text-[10px] pb-1" >{fat} g</Text>
                                <ProgressBar progress={fat / 200} color={"#FBBB57"} className="h-1 rounded" />
                                <Text className="text-white text-[10px] pt-1" >Fat</Text>
                            </View>
                            <View>
                                <Text className="text-white text-[10px] pb-1" >{protein} g</Text>
                                <ProgressBar progress={protein / 200} color={"#57DB54"} className="h-1 rounded" />
                                <Text className="text-white text-[10px] pt-1" >Protien</Text>
                            </View>

                        </View>
                    </View>

                    <View style={[styles.content, styles.c2]}>
                        <Text className="font-bold p-5 text-lg text-Orange " >MEALS TODAY</Text>

                        <View className="gap-4">
                            {listMeal(require("../../../assets/img/icons8-sunny-side-up-eggs-96.png"), "BreakFast", breakfast.calories, navigation)}
                            <View className="border-b  border-Darkgray opacity-20" />
                            {listMeal(require("../../../assets/img/icons8-vegetarian-food.png"), "Brunch", brunch.calories, navigation)}
                            <View className="border-b border-Darkgray opacity-20 " />
                            {listMeal(require("../../../assets/img/icons8-thanksgiving-96.png"), "Lunch", lunch.calories, navigation)}
                            <View className="border-b border-Darkgray opacity-20 " />
                            {listMeal(require("../../../assets/img/icons8-pie-96.png"), "Afternoon Lunch", afternoonlunch.calories, navigation)}
                            <View className="border-b border-Darkgray opacity-20 " />
                            {listMeal(require("../../../assets/img/icons8-steak-96.png"), "Dinner", dinner.calories, navigation)}
                            <View className="border-b border-Darkgray opacity-20 " />
                            {listMeal(require("../../../assets/img/icons8-vegan-food-96.png"), "After Dinner", afterdinner.calories, navigation)}
                        </View>


                    </View>

                </View>
            </ScrollView>

        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FB',
        alignItems: 'center',
        position: 'relative',

    },
    container1: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',

    },
    content: {
        width: 320,
        paddingBottom: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,
        elevation: 5,

    },
    c1: {
        backgroundColor: '#025146',
        height: 220,
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-between',
    },
    c2: {
        backgroundColor: 'white',
    },
    ringChartContainer: {
        width: radius * 2,
        height: radius * 2,
        marginTop: 10,
    },
    button: {
        marginTop: 5,
        backgroundColor: "orange",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 10,
    },
    progress: {
        gap: 20,
        width: 100,
        justifyContent: 'center',
    },
    blur: {
        backgroundColor: 'black',
        opacity: 0.5,
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    innerCircle: {
        position: 'absolute',
        justifyContent: 'center',
        marginTop: 30,
        marginLeft: 20,
        width: 120,
        height: 100,
    }
});

export default DashboardDayScreen;