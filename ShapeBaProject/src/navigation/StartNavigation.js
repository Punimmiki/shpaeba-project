import React from 'react';

// Navigate
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Page
import StartScreen from '../screens/StartScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignInScreen';
import ProcessInfoScreen1 from '../screens/ProcessInfo/ProcessInfoScreen1';
import ProcessInfoScreen2 from '../screens/ProcessInfo/ProcessInfoScreen2';
import ProcessInfoScreen3 from '../screens/ProcessInfo/ProcessInfoScreen3';

import DashboardDayScreen from '../screens/Dashboard/DashboardDayScreen';
import DetailMealsScreen from '../screens/Meal/DetailMealsScreen';
import AddMealsScreen from '../screens/Meal/AddMealsScreen';
import RecommendScreen from '../screens/Dashboard/RecommendScreen';


const StartStack = createNativeStackNavigator();
const SignInStack = createNativeStackNavigator();
const SignUpStack = createNativeStackNavigator();

function SignInNavigator() {
    return (
        <SignInStack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <SignInStack.Screen name="SignInScreen" component={SignInScreen} />
            <SignInStack.Screen name="DashboardDayScreen" component={DashboardDayScreen} />

            <SignInStack.Screen name="DetailMealsScreen" component={DetailMealsScreen} />
            <SignInStack.Screen name="AddMealsScreen" component={AddMealsScreen} />
            <SignInStack.Screen name="RecommendScreen" component={RecommendScreen} />
        </SignInStack.Navigator>
    )
}
function SignUpNavigator() {
    return (
        <SignUpStack.Navigator 
            screenOptions={{ 
                headerShown: false
            }}>
            <SignUpStack.Screen name="SignUpScreen" component={SignUpScreen} />
            <SignUpStack.Screen name="ProcessInfoScreen1" component={ProcessInfoScreen1} />
            <SignUpStack.Screen name="ProcessInfoScreen2" component={ProcessInfoScreen2} />
            <SignUpStack.Screen name="ProcessInfoScreen3" component={ProcessInfoScreen3} />
            <SignUpStack.Screen name="DashboardDayScreen" component={DashboardDayScreen} />

            <SignInStack.Screen name="DetailMealsScreen" component={DetailMealsScreen} />
            <SignInStack.Screen name="AddMealsScreen" component={AddMealsScreen} />
            <SignInStack.Screen name="RecommendScreen" component={RecommendScreen} />
        </SignUpStack.Navigator>
    )
}
export default function StartNavigator() {
    return (
        <NavigationContainer>
            <StartStack.Navigator screenOptions={{headerShown: false}}>
                <StartStack.Screen name="StartScreen" component={StartScreen} />
                <StartStack.Screen name="SignInNavigator" component={SignInNavigator} />
                <StartStack.Screen name="SignUpNavigator" component={SignUpNavigator} />
            </StartStack.Navigator>
        </NavigationContainer>
    )
}
