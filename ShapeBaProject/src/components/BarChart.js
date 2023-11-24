import {
    Canvas,
    Path,
    runTiming,
    Skia,
    Text,
    useComputedValue,
    useFont,
    useValue,
} from "@shopify/react-native-skia";
import React, { useState, useRef, useEffect } from "react";
import { Button, Easing, StyleSheet, View, Animated } from "react-native";
// chart
import * as d3 from "d3";
// firebase
import { db, collection, getDocs, query, where, deleteDoc, doc, updateDoc } from '../../firebase-cofig'
// redux
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, setUserEmail, userSelector } from '../store/slice/userSlice';
import { useFocusEffect } from "@react-navigation/native";



// ---------------- get current date --------------------------
const currentDate = new Date();
const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0')
const year = currentDate.getFullYear();
const dayOfWeek = currentDate.getDay()
const today = `${day}/${month}/${year}` // String type

const sundayDateFull = new Date(currentDate)
sundayDateFull.setDate(currentDate.getDate() - dayOfWeek)
const sundayDay = String(sundayDateFull.getDate()).padStart(2, '0')
const sundayMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
const sundayYear = sundayDateFull.getFullYear()
const sundayDate = `${sundayDay}/${sundayMonth}/${sundayYear}`
// -------------------------------------------------------------

const GRAPH_MARGIN = 20;
const GRAPH_BAR_WIDTH = 14;

const CanvasHeight = 230;
const CanvasWidth = 300;
const graphHeight = CanvasHeight - 2 * GRAPH_MARGIN;
const graphWidth = CanvasWidth - 2;


export const BarChart = (props) => {
    const [dataChart, setDataChart] = useState([])
    let collectMenuInWeek = []
    
    // ---------------- get data from database ----------------
    // reduct store
    const userStore = useSelector(userSelector);
    const userId = userStore.userId
    
    const getCalsDataPerDay = async () => {
        console.log("BEGINNNNNN ......... ", collectMenuInWeek)
        let sumCalsPerWeek = [] // collect sum of calories per each day in each week
        let tempDocsOneWeek = [] // colect Meal data in this week
        // let mealsInDay = []

        try {
            const querySnapshot = query(collection(db, "dailyMeal"), where("user_id", "==", userId))
            const getCalsData = await(getDocs(querySnapshot))

            // change date format from string -> date
            const parseDate = (dateString) => {
                const parts = dateString.split("/")
                if (parts.length == 3) {
                    const [day, month, year] = parts
                    return new Date(year, month - 1, day)
                }
                return null
            }
            getCalsData.forEach((doc) => {
                const docDate = parseDate(doc.data().dateInfo.date)
                if (docDate) {
                    const sundayDateObj = parseDate(sundayDate)
                    const currentDateObj = parseDate(today)

                    if (docDate >= sundayDateObj && docDate <= currentDateObj) {
                        tempDocsOneWeek.push(doc.data())
                    }
                }
            })

            const dayWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            dayWeek.forEach((dayWeek) => {
                const sumObject = { dayOfWeek: dayWeek, sumCalPerDay: 0 };
                sumCalsPerWeek.push(sumObject)
            })
            
            let sum = 0
            let mealsInDay = []
            tempDocsOneWeek.forEach((docPerDay) => {
                let sumCalPerDay = 0
                // sum cal in each doc
                const mealTypes = ['breakfast', 'brunch', 'lunch', 'afternoonlunch', 'dinner', 'afterdinner']
                mealTypes.forEach((mealTypes) => {
                    if (docPerDay[mealTypes].length !== 0) {
                        docPerDay[mealTypes].forEach((menuMeal) => {
                            sumCalPerDay += parseFloat(menuMeal.calories)
                            mealsInDay.push({name: menuMeal.name, calories: menuMeal.calories})
                        })
                    }
                })

                const matchingDay = sumCalsPerWeek.find((day) => day.dayOfWeek === docPerDay.dateInfo.dayOfWeek)
                if (matchingDay) {
                    matchingDay.sumCalPerDay = sumCalPerDay
                }
                sum += sumCalPerDay

            })

            // sort calories rank 5
            mealsInDay.sort((a, b) => parseFloat(b.calories) - parseFloat(a.calories));
            if (mealsInDay.length < 5) {
                mealsInDay = [...mealsInDay];
            } else {
                mealsInDay = mealsInDay.slice(0, 5);
            }

            collectMenuInWeek.push(...mealsInDay)
            props.setUsedData(collectMenuInWeek)
            // console.log("USE COLLECTION __________ ", usedData)

            props.setCollectSumCalPerDay(sum / 7)
            setDataChart(sumCalsPerWeek)

        }
        catch (error) {
            console.log("get cals Bar Chart >>> ", error)
        }
    }
    // ---------------------------------------------------------------------

    const [success, setSuccess] = useState(true);

    const font = useFont(require("../../assets/font/Roboto-Bold.ttf"), 10);
    const [animationState, setAnimationState] = useState(new Animated.Value(0));

    const xDomain = dataChart.map((dataPoint) => dataPoint.dayOfWeek)
    const xRange = [0, graphWidth];
    const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

    const yDomain = [
        0,
        d3.max(dataChart, (yDataPoint) => yDataPoint.sumCalPerDay),
    ];

    const maxSumCalPerDay = d3.max(dataChart, (yDataPoint) => yDataPoint.sumCalPerDay)
    const yRange = [0, graphHeight]
    const y = d3.scaleLinear().domain([0, maxSumCalPerDay]).range(yRange)

    // for horizontal line // TODO: horizontal
    const tdeeY = y(props.getTDEE);
    const horizontalLinePath = Skia.Path.Make();
    horizontalLinePath.moveTo(0, tdeeY);
    horizontalLinePath.lineTo(graphWidth, tdeeY);

    useFocusEffect(
        React.useCallback(() => {
            collectMenuInWeek = []
            console.log("/////////// ", collectMenuInWeek)
            getCalsDataPerDay();
            return () => {
                props.setCollectSumCalPerDay(0);
            };
        }, [userId])
    );

    const Bar = (label, value) => {
        const newPath = Skia.Path.Make()
        const barHeight = y(value)
        const scaledBarHeight = barHeight * (maxSumCalPerDay / 3000)
        const rect = Skia.XYWHRect(
            x(label) - GRAPH_BAR_WIDTH / 2,
            graphHeight - scaledBarHeight, // Position the bars within the max height
            GRAPH_BAR_WIDTH,
            scaledBarHeight
            // graphHeight,
            // GRAPH_BAR_WIDTH,
            // y(value) * -1
        );

        const rrect = Skia.RRectXY(rect, 8, 8);
        newPath.addRRect(rrect);

        return newPath;
    }

    if (!font) {
        return <View />;
    }
    console.log("CHART WEEK >>>>> ", dataChart)

    // const path = Bar();
    return (
        <View style={styles.container}>
            <Canvas style={styles.canvas}>
                {dataChart.map((dataPoint) => (
                    dataPoint.sumCalPerDay > props.getTDEE ? 
                        <Path key={dataPoint.dayOfWeek} path={Bar(dataPoint.dayOfWeek, dataPoint.sumCalPerDay)} color="#FBBB57" />
                        : <Path key={dataPoint.dayOfWeek} path={Bar(dataPoint.dayOfWeek, dataPoint.sumCalPerDay)} color="#EC744A" />
                ))}


                {dataChart.map((dataPoint) => (
                    <Text
                        key={dataPoint.dayOfWeek}
                        font={font}
                        x={x(dataPoint.dayOfWeek) - 10}
                        y={CanvasHeight - 25}
                        text={dataPoint.dayOfWeek.slice(0, 3)}
                    />
                ))}
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    canvas: {
        height: CanvasHeight,
        width: CanvasWidth,
    },
});
