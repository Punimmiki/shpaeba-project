import React, { useState } from "react";
import {
    Canvas,
    Path,
    SkFont,
    Skia,
    SkiaMutableValue,
    // Text,
} from "@shopify/react-native-skia";
import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { processInfoSelector, getGoalById } from "../store/slice/processInfoSlice1";
import { useFocusEffect } from '@react-navigation/native';

const DonutChart = ({
    strokeWidth,
    radius,
    percentageComplete,
    font,
    smallerFont,
    targetPercentage,
    tdee,
    calories,

}) => {
    const innerRadius = radius - strokeWidth / 2;
    const targetText = `${targetPercentage * 100}`;
    // console.log("targetPercentage", targetPercentage)

    const path = Skia.Path.Make();
    path.addCircle(radius, radius, innerRadius);

    const width = font.getTextWidth(targetText);
    const titleWidth = smallerFont.getTextWidth("Power");
    //redux
    const processInfo = useSelector(processInfoSelector);

    useFocusEffect(
        React.useCallback(() => {
            console.log("----------DonutChart", calories)
            
        }, [tdee, calories])
    );

    return (
        <View style={styles.container}>
            <Canvas style={styles.container}>
                <Path
                    path={path}
                    color="#EC744A"
                    style="stroke"
                    strokeJoin="round"
                    strokeWidth={strokeWidth}
                    strokeCap="round"
                    start={0}
                    end={percentageComplete}
                />

            </Canvas>
            <View style={styles.innerCircle}>
                <Text className="text-xl font-bold text-white text-center">{calories} /{tdee} </Text>
                <Text className="text-sm font-medium text-white text-center">calories</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {

        fontSize: 20,
        color: "white",
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

export default DonutChart;