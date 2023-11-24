import { Image } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { AUTH } from "../../firebase-cofig";
import { onAuthStateChanged } from 'firebase/auth'

// Navigate
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Icon
import { Ionicons, AntDesign } from '@expo/vector-icons';
// Page
import DashboardDayScreen from '../screens/Dashboard/DashboardDayScreen';
import DashboardWeekScreen from '../screens/Dashboard/DashboardWeekScreen';
import DashboardMonthScreen from '../screens/Dashboard/DashboardMonthScreen';
import DetailMealsScreen from '../screens/Meal/DetailMealsScreen';
import AddMealsScreen from '../screens/Meal/AddMealsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PersonalInfoScreen from '../screens/Profile/PersonalInfoScreen';
import StartNewGoalScreen from '../screens/Profile/StartNewGoalScreen';
import RecommendScreen from '../screens/Dashboard/RecommendScreen';
import TapToStart from '../screens/ProcessInfo/TapToStart';
import HistoryScreen from '../screens/Profile/HistoryScreen';
import InformationScreen from '../screens/Profile/InformationScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProcessInfoScreen1 from '../screens/ProcessInfo/ProcessInfoScreen1';
import ProcessInfoScreen2 from '../screens/ProcessInfo/ProcessInfoScreen2';
import ProcessInfoScreen3 from '../screens/ProcessInfo/ProcessInfoScreen3';
import StartScreen from '../screens/StartScreen';
import SummaryScreen from '../screens/Dashboard/Summary';
//component
import BottomSheet from "../components/MealBottomSheet";
import { Button } from '@rneui/themed';
import { View, Text, TouchableOpacity } from 'react-native';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { frontEndSelector, setOpenStartDatePicker } from '../store/slice/frontEndSlice';
import { userSelector, setUserId, setUserEmail } from '../store/slice/userSlice';
import { Foundation } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Backtoprofile from '../screens/Profile/Backtoprofile';

const MainStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const processInfoStack = createNativeStackNavigator();
const homeStack = createNativeStackNavigator();


function ProcessInfoNavigate() {
    return (
        <processInfoStack.Navigator screenOptions={{ headerShown: false }}>
            <processInfoStack.Screen name="ProcessInfoScreen1" component={ProcessInfoScreen1} />
            <processInfoStack.Screen name="ProcessInfoScreen2" component={ProcessInfoScreen2} />
            <processInfoStack.Screen name="ProcessInfoScreen3" component={ProcessInfoScreen3} />
            <processInfoStack.Screen name="TapToStart" component={TapToStart} />

            <processInfoStack.Screen name="BottomNavigate" component={BottomNavigate} />
            <processInfoStack.Screen name="DetailMealsScreen" component={DetailMealsScreen} />
            <processInfoStack.Screen name="AddMealsScreen" component={AddMealsScreen} />
            <processInfoStack.Screen name="RecommendScreen" component={RecommendScreen} />
            <processInfoStack.Screen name="SummaryScreen" component={SummaryScreen} />
        

        </processInfoStack.Navigator>
    )

}

function HomeNavigate() {
    return (
        <homeStack.Navigator screenOptions={{ headerShown: false }}>
            <homeStack.Screen name="BottomNavigate" component={BottomNavigate} />
            <homeStack.Screen name="DetailMealsScreen" component={DetailMealsScreen} />
            <homeStack.Screen name="AddMealsScreen" component={AddMealsScreen} />
            <homeStack.Screen name="RecommendScreen" component={RecommendScreen} />
            <homeStack.Screen name="SummaryScreen" component={SummaryScreen} />
        </homeStack.Navigator>
    )

}
// Navigator From Dashboard to AddMeal
function MainNavigator() {
    const userStore = useSelector(frontEndSelector);
    console.log(userStore.SignUpState)
    return (
        <MainStack.Navigator initialRouteName='ProcessInfoNavigate'
            screenOptions={{
                headerShown: false,
            }}

        >
            {userStore.SignUpState ?
                <MainStack.Screen name="ProcessInfoNavigate" component={ProcessInfoNavigate} />
                :
                <MainStack.Screen name="HomeNavigate" component={HomeNavigate} />
            }

        </MainStack.Navigator>
    )
}

function LogInNavigate() {
    return (
        <LoginStack.Navigator initialRouteName='StartScreen'
            screenOptions={{
                headerShown: false,
            }}
        >
            <LoginStack.Screen name="StartScreen" component={StartScreen} />
            <LoginStack.Screen name="SignInScreen" component={SignInScreen} />
            <LoginStack.Screen name="SignUpScreen" component={SignUpScreen} />

        </LoginStack.Navigator>
    )
}


// Navigator in Profile Page
function ProfileNavigate() {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
            <ProfileStack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
            <ProfileStack.Screen name="StartNewGoalScreen" component={StartNewGoalScreen} />
            <ProfileStack.Screen name="HistoryScreen" component={HistoryScreen} />
            <ProfileStack.Screen name="InformationScreen" component={InformationScreen} />
            <ProfileStack.Screen name="Backtoprofile" component={Backtoprofile} />
        </ProfileStack.Navigator>
    )
}

// topTab DashboardDay
function MyTopTabs() {
    return (
        <TopTab.Navigator>
            {/* <TopTab.Screen name="SignInScreen" component={SignInScreen} /> */}
            <TopTab.Screen name="DashboardDayScreen" component={DashboardDayScreen}
                options={({ route }) => ({
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route)
                        // console.log(routeName)
                        if (routeName === 'DetailMealsScreen' || routeName === 'RecommendScreen') {
                            return { display: "none" }
                        }
                        return
                    })(route),
                    title: "Day"
                })}
            />
            <TopTab.Screen name="DashboardWeekScreen" component={DashboardWeekScreen} options={{ title: "Week" }} />
            <TopTab.Screen name="DashboardMonthScreen" component={DashboardMonthScreen} options={{ title: "Month" }} />
        </TopTab.Navigator>
    );
}
const headerLeft = () => {
    const userStore = useSelector(userSelector);
    const name = userStore.userEmail.split('@')[0]
    return (
        <View className="h-10 bg-pink">
            {userStore.userEmail ? <Text className="text-xl font-bold ml-3">{name}</Text> : <Text className="text-xl font-bold ml-3">ShapeBa </Text>}

            <Text className="text-sm font-bold ml-3 text-Darkgray opacity-60">Let's track daily cals</Text>
        </View>
    );
}


function BottomNavigate() {
    //for DatePicker
    const dispatch = useDispatch();
    const frontEndStore = useSelector(frontEndSelector);
    const openStartDatePicker = frontEndStore.openStartDatePicker;
    return (
        <BottomTab.Navigator
            screenOptions={{
                headerTitle: () => headerLeft(),
                headerRight: () => (
                    <TouchableOpacity className="mr-3" onPress={() => dispatch(setOpenStartDatePicker(!openStartDatePicker))}>
                        <AntDesign name="calendar" size={24} color="#025146" />
                    </TouchableOpacity>
                ),
                headerStyle: {
                    height: 80,
                },
                headerTintColor: 'black',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                activeTintColor: 'red', // สีของ Tab ที่ถูกเลือก
                inactiveTintColor: 'gray',

            }}
        >
            <BottomTab.Screen name="Home" component={MyTopTabs}
                options={({ route }) => ({
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route)
                        console.log(routeName)
                        if (routeName === 'DetailMealsScreen' || routeName === 'RecommendScreen') {
                            return { display: "none" }
                        }
                        return
                    })(route),
                    title: "Home",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <View >
                                <Octicons name="home" size={25} color="#025146" />
                            </View>
                        )
                    },
                })}
            />
            <BottomTab.Screen name="Profile" component={ProfileNavigate}
                options={({ route }) => ({
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route)
                        if (routeName == 'HistoryScreen' || routeName == 'StartNewGoalScreen' || routeName == 'InformationScreen') {
                            return { display: "none" }
                        }
                        return
                    })(route),
                    tabBarIcon: ({ color, size }) => {
                        return <Octicons name="person" size={25} color="#025146" />
                    },
                    headerShown: false,
                })}
            />
        </BottomTab.Navigator>
    );
}

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const [user, setUser] = useState(null)
    //redux
    const dispatch = useDispatch();
    useEffect(() => {
        onAuthStateChanged(AUTH, (user) => {
            console.log('user', user)
            setUser(user)
        })
    }, [user])
    return (
        <NavigationContainer >
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                {user ?
                    <Stack.Screen name="MainNavigator" component={MainNavigator} />
                    :
                    <Stack.Screen name="LogInNavigate" component={LogInNavigate} />
                }



            </Stack.Navigator>

            {/* <MainNavigator /> */}
        </NavigationContainer>
    )
}

