import React, { useState, useEffect } from "react";

import {
    Canvas,
    Line,
    Path,
    runTiming,
    Skia,
    SkPath,
    useComputedValue,
    useValue,
    vec,
} from "@shopify/react-native-skia";

// import { animatedData, DataPoint, originalData } from "./Data";
import { curveBasis, line, scaleLinear, scaleTime, scalePoint } from "d3";
import { Easing, View, Pressable, Text, StyleSheet } from "react-native";
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

const firstDateMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
const firstDay = String(firstDateMonth.getDate()).padStart(2, '0')
const firstMonth = String(firstDateMonth.getMonth() + 1).padStart(2, '0')
const firstYear = firstDateMonth.getFullYear();
const firstDateOfMonth = `${firstDay}/${firstMonth}/${firstYear}`

const lastDateMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
const lastDay = String(lastDateMonth.getDate()).padStart(2, '0')
const lastMonth = String(lastDateMonth.getMonth() + 1).padStart(2, '0')
const lastYear = lastDateMonth.getFullYear();
const lastDateOfMonth = `${lastDay}/${lastMonth}/${lastYear}`
const numberOfDaysInMonth = lastDateMonth.getDate()

// -------------------------------------------------------------
export const LineChart = (props) => {
    const [dataChart, setDataChart] = useState([])
    const [pathGraph, setPathGraph] = useState(null)
    const [successDay, setSuccessDay] = useState(0)
    
    // ---------------- get data from database ----------------
    // reduct store
    const userStore = useSelector(userSelector);
    const userId = userStore.userId
    
    const getCalsDataPerDay = async () => {
        let sumCalsPerMonth = [] // collect sum of calories per each day in each week
        let tempDocsOneMonth = [] // colect Meal data in this week

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
                    const currentDateObj = parseDate(today) // Date format
                    const firstDateOfMonthObj = parseDate(firstDateOfMonth) // Date format

                    if (docDate >= firstDateOfMonthObj && docDate <= currentDateObj) {
                        tempDocsOneMonth.push(doc.data())
                    }
                }
            })

            let sumCalPerDay = 0
            let currentYear = currentDate.getFullYear();
            let currentMonth = currentDate.getMonth();
            console.log("MONTH ... ", currentMonth)

            for (let dayy = 2; dayy <= numberOfDaysInMonth + 2; dayy++) { // FIXME: month 31 days must plus 2 ??
                if (currentMonth < 0) {
                    currentMonth = 11; // 0-based, so December is 11
                    currentYear--;
                }

                const dailyDate = new Date(currentYear, currentMonth, dayy);
                const formatDate = dailyDate.toISOString();
                const sumObject = { date: formatDate, value: 0 };
                sumCalsPerMonth.push(sumObject);
            }
            
            let sum = 0
            let success = 0
            tempDocsOneMonth.forEach((docPerDay) => {
                console.log("IMNNNN")
                // sum cal in each doc
                const mealTypes = ['breakfast', 'brunch', 'lunch', 'afternoonlunch', 'dinner', 'afterdinner']
                mealTypes.forEach((mealTypes) => {
                    if (docPerDay[mealTypes].length !== 0) {
                        docPerDay[mealTypes].forEach((menuMeal) => {
                            sumCalPerDay += parseFloat(menuMeal.calories)
                        })
                    }
                })
                if (sumCalPerDay === 1975) {
                    success += 1
                }
                console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS ", success)
                setSuccessDay(success)
                console.log("MMMMMMMMMMMMMMMMMM")
                const matchingDay = sumCalsPerMonth.find((day) => day.date === parseDate(docPerDay.dateInfo.date).toISOString())
                if (matchingDay) {
                    matchingDay.value = sumCalPerDay
                }
                sum += sumCalPerDay
            })
            console.log(">>>>>>>> ", sum)
            props.setCollectSumCalPerDay(sum / 30)
            setDataChart(sumCalsPerMonth)

        }
        catch (error) {
            console.log("get cals Bar Chart >> ", error)
        }
    }
    // console.log("DATA MONTH >>>> ", dataChart)
    // -----------------------------------------------------------------------------------

    const transition = useValue(1);
    const state = useValue({
        current: 0,
        next: 1,
    });

    const GRAPH_HEIGHT = 300;
    const GRAPH_WIDTH = 320;

    const makeGraph = (data) => {
        const max = Math.max(...data.map((val) => val.value));
        const min = Math.min(...data.map((val) => val.value));
        const y = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 100]);
        // const xDomain = animatedData.map((dataPoint) => dataPoint.date)
        const x = scaleTime()
        .domain([new Date(year, month - 1, 1), new Date(year, month - 1, numberOfDaysInMonth)])
        .range([10, GRAPH_WIDTH - 10]); 
        
        const curvedLine = line()
            .x((d) => x(new Date(d.date)))
            .y((d) => y(d.value))
            .curve(curveBasis)(data);

        const skPath = Skia.Path.MakeFromSVGString(curvedLine);

        return {
            max,
            min,
            curve: skPath,
        };
    };

    //animate graph
    const end = 1
    const transitionStart = (end) => {
        state.current = {
            current: end,
            next: state.current.current,
        };
        transition.current = 0;
        runTiming(transition, 1, {
            duration: 750,
            easing: Easing.inOut(Easing.cubic),
        });
    };

        console.log(".....................................")
        // useEffect(() => {
        //     console.log("INNNNNN")
        //     if (dataChart.length !== 0) {
        //         // getCalsDataPerDay()
        //         const graphData = [makeGraph(dataChart), makeGraph(dataChart)]
        //         const start = graphData[state.current.current].curve;
        //         const end = graphData[state.current.next].curve;
        //         const result = start.interpolate(end, transition.current);
        //         const svgString = result?.toSVGString() ?? "0";
        //         setPathGraph(svgString)
        //     }
        //     else {
        //         getCalsDataPerDay()
        //     }
        // }, [dataChart, state, transition, props.collectSumCalPerDay])

        useFocusEffect(
            React.useCallback(() => {
                if (dataChart.length !== 0) {
                    // getCalsDataPerDay()
                    console.log("OOOOOOOO  ", successDay)
                    const graphData = [makeGraph(dataChart), makeGraph(dataChart)]
                    const start = graphData[state.current.current].curve;
                    const end = graphData[state.current.next].curve;
                    const result = start.interpolate(end, transition.current);
                    const svgString = result?.toSVGString() ?? "0";
                    setPathGraph(svgString)
                }
                else {
                    getCalsDataPerDay()
                }
            }, [dataChart, state, transition, props.collectSumCalPerDay])
        )

    return (
        <View style={styles.container}>
            <Canvas
                style={{
                    width: GRAPH_WIDTH,
                    height: GRAPH_HEIGHT,
                }}
            >
                { pathGraph !== null ?
                    <Path style="stroke" path={pathGraph} strokeWidth={4} color="#EC744A" /> :
                    null
                }
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "white",
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    buttonStyle: {
        marginRight: 20,
        backgroundColor: "#6231ff",
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    textStyle: {
        color: "white",
        fontSize: 20,
    },
});
