import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AntDesign, Entypo } from '@expo/vector-icons';
import { userSelector, getUserId } from '../../store/slice/userSlice'
import { useFocusEffect } from "@react-navigation/native";
//firebase
import { db, collection, getDocs, query, where, } from '../../../firebase-cofig';

const listMeal = (icon, meal, cal) => {
    return (
        <View className="flex-row justify-between" >
            <View className="flex-row gap-5 pl-3 items-center">
                <Image source={icon}
                    style={{ width: 40, height: 40 }} />
                <Text className="font-medium text-base text-Darkgray">{meal}</Text>
            </View>
            <Text className="font-medium text-base text-Darkgray mr-4 mt-2">{cal} cals</Text>
        </View>
    )
}

const Summary = ({ route, navigation }) => {
    const date = route.params.selectDate
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
    const [rerender, setRerender] = useState(false)

    //Get Daily meal by User ID
    const getDailyMenuById = async () => { // Pass the user ID as an argument
        try {
            const userId = await getUserId()
            const temp = date.split("/")

            const today = `${temp[2]}/${temp[1]}/${temp[0]}`;
            console.log("date", today)
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
            //rerender
            setRerender(true)

        } catch (error) {
            console.error("Error fetching user menu: ", error);
        }

    }
    const chartInfo = () => {
        //for chart
        setCal(Number((breakfast.calories + brunch.calories + lunch.calories + afternoonlunch.calories + dinner.calories + afterdinner.calories).toFixed(0)))
        setCarb(Number(breakfast.carbohydrates + brunch.carbohydrates + lunch.carbohydrates + afternoonlunch.carbohydrates + dinner.carbohydrates + afterdinner.carbohydrates).toFixed(1))
        setFat(Number(breakfast.fat + brunch.fat + lunch.fat + afternoonlunch.fat + dinner.fat + afterdinner.fat).toFixed(1))
        setProtein(Number(breakfast.protein + brunch.protein + lunch.protein + afternoonlunch.protein + dinner.protein + afterdinner.protein).toFixed(1))
        console.log("carb", carb, typeof carb)
        console.log("breakfase", breakfast, typeof breakfast.carbohydrates)
        console.log("--------total cal", cal)

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

    useEffect(() => {
        getDailyMenuById();
        if (isNaN(breakfast.calories) === false) {
            console.log("Carb:", carb);
            chartInfo();
        }
    }, [rerender])

    return (
        <View style={styles.container}>
            {/* header */}
            <View className="w-full h-14 flex justify-center pl-5 mt-6">
                <View className="flex flex-row">
                    <TouchableOpacity style={{ marginRight: 15, marginTop: 3 }} onPress={() => navigation.goBack()}>
                        <AntDesign name="leftcircleo" size={25} color="white" />
                    </TouchableOpacity>
                    <Text className="text-lg text-white">{date} </Text>
                </View>
            </View>
            <Text className="font-bold text-2xl text-white mt-5 pb-2">Total Calories</Text>
            <Text className="font-bold text-2xl text-white  pb-2">{cal} </Text>
            <View className="flex flex-row mt-2">
                <Text className="font-bold text-lg text-white">Carb {carb}</Text>
                <Text className="font-bold text-lg text-white pl-3">Fat {fat} </Text>
                <Text className="font-bold text-lg text-white pl-3">Protien {protein}</Text>
            </View>
            <View style={styles.box2}>
                <Text className="font-bold p-5 text-lg text-Orange pb-6 pt-6" >MEALS SUMMARY</Text>
                <View className="w-full px-6">
                    <View className="gap-4">
                        {listMeal(require("../../../assets/img/icons8-sunny-side-up-eggs-96.png"), "BreakFast", breakfast.calories)}
                        <View className="border-b  border-Darkgray opacity-20" />
                        {listMeal(require("../../../assets/img/icons8-vegetarian-food.png"), "Brunch", brunch.calories)}
                        <View className="border-b border-Darkgray opacity-20 " />
                        {listMeal(require("../../../assets/img/icons8-thanksgiving-96.png"), "Lunch", lunch.calories)}
                        <View className="border-b border-Darkgray opacity-20 " />
                        {listMeal(require("../../../assets/img/icons8-pie-96.png"), "Afternoon Lunch", afternoonlunch.calories)}
                        <View className="border-b border-Darkgray opacity-20 " />
                        {listMeal(require("../../../assets/img/icons8-steak-96.png"), "Dinner", dinner.calories)}
                        <View className="border-b border-Darkgray opacity-20 " />
                        {listMeal(require("../../../assets/img/icons8-vegan-food-96.png"), "After Dinner", afterdinner.calories)}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Summary

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#025146',
        alignItems: 'center',
        position: 'relative',

    },
    content: {
        width: 320,
        paddingBottom: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,

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
        alignContent: 'flex-start',
    },

    box2: {
        backgroundColor: 'white',
        width: "100%",
        height: "100%",
        borderTopEndRadius: 50,
        marginTop: 50,
        alignItems: 'center',
        // justifyContent: 'center',

    },
})