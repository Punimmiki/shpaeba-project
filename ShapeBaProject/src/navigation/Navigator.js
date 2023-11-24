import React from 'react';

// Navigate
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Page
import TestPage from '../screens/Test';
import StartScreen from '../screens/StartScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProcessInfoScreen1 from '../screens/ProcessInfo/ProcessInfoScreen1';
import ProcessInfoScreen2 from '../screens/ProcessInfo/ProcessInfoScreen2';
import ProcessInfoScreen3 from '../screens/ProcessInfo/ProcessInfoScreen3';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PersonalInfoScreen from '../screens/Profile/PersonalInfoScreen';
import DashboardDayScreen from '../screens/Dashboard/DashboardDayScreen';
import DashboardWeekScreen from '../screens/Dashboard/DashboardWeekScreen';
import DashboardMonthScreen from '../screens/Dashboard/DashboardMonthScreen';
import DetailMealsScreen from '../screens/Meal/DetailMealsScreen';
import AddMealsScreen from '../screens/Meal/AddMealsScreen';
import AddMyMealsScreen from '../screens/Meal/AddMyMealsScreen';
import RecommendScreen from '../screens/Dashboard/RecommendScreen';
import StartNewGoalScreen from '../screens/Profile/StartNewGoalScreen';
import HistoryScreen from '../screens/Profile/HistoryScreen';


const Stack = createNativeStackNavigator();

export default function TestNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='TestPage'>
                <Stack.Screen name="TestPage" component={TestPage} />
                <Stack.Screen name="StartScreen" component={StartScreen} />
                <Stack.Screen name="SignInScreen" component={SignInScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen name="ProcessInfoScreen1" component={ProcessInfoScreen1} />
                <Stack.Screen name="ProcessInfoScreen2" component={ProcessInfoScreen2} />
                <Stack.Screen name="ProcessInfoScreen3" component={ProcessInfoScreen3} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen}
                    options={{
                        headerTintColor: 'white',
                        headerStyle: {backgroundColor: '#025146', elevation: 0,}
                    }}
                />
                <Stack.Screen name="DashboardDayScreen" component={DashboardDayScreen} />
                <Stack.Screen name="DashboardWeekScreen" component={DashboardWeekScreen} />
                <Stack.Screen name="DashboardMonthScreen" component={DashboardMonthScreen} />
                <Stack.Screen name="DetailMealsScreen" component={DetailMealsScreen}
                    options={{
                        headerTintColor: 'white',
                        headerStyle: {backgroundColor: '#025146', elevation: 0,}
                    }}
                />
                <Stack.Screen name="AddMealsScreen" component={AddMealsScreen}
                    options={{
                        headerTintColor: 'white',
                        headerStyle: {backgroundColor: '#025146', elevation: 0,}
                    }}
                />
                <Stack.Screen name="AddMyMealsScreen" component={AddMyMealsScreen} />
                <Stack.Screen name="RecommendScreen" component={RecommendScreen} />
                <Stack.Screen name="StartNewGoalScreen" component={StartNewGoalScreen}
                    options={{
                        headerTintColor: 'white',
                        headerStyle: {backgroundColor: '#025146', elevation: 0,}
                    }}
                />
                <Stack.Screen name="HistoryScreen" component={HistoryScreen}
                    options={{
                        headerTintColor: 'white',
                        headerStyle: {backgroundColor: '#025146', elevation: 0,},
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
