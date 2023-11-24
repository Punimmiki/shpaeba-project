import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable } from 'react-native';
import { Button, Header } from 'react-native-elements';
import { AntDesign, Feather } from '@expo/vector-icons';
import React, {useEffect, useState} from "react";
import { useFocusEffect } from "@react-navigation/native";

// Segment
import AddMealsSegment from '../../components/AddMealsSegment';

// Redux
import { useDispatch } from 'react-redux';
import { setMenus } from '../../store/slice/mealsSlice';

const AddMealsScreen = ({ navigation, route }) => {
    const [searchInput, setSearchInput] = useState("")
    const [btnSearch, setBtnSearch] = useState(false)
    
    const toggleBtnSearch = () => {
        setBtnSearch(true)
        console.log("handle button search")
    }

    // useEffect(() => {
    //     if (btnSearch) {
    //         // const dispatch = useDispatch()
    //         // dispatch(setMenus([]))
    //         // setBtnSearch(false);
    //     }
    // }, [btnSearch]);

    return (
        <View style={styles.container}>
            <Header backgroundColor="#025146" containerStyle={styles.header}>
                <View style={{ width: 370, paddingLeft: 20, paddingRight: 20 }}>
                    <View className="mt-6" style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginRight: 15, marginTop: 3 }} onPress={() => navigation.goBack()}>
                            <AntDesign name="leftcircleo" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white mb-2 text-xl font-bold">What do you eat ?</Text>
                    </View>
                    <Text className="text-white mb-6 ml-10 text-base">Let see the calories !</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            className="bg-white rounded-3xl pl-4 h-10 mb-5"
                            style={{ flex: 1, }}
                            placeholder='Search ...'
                            value={searchInput}
                            onChangeText={(text) => setSearchInput(text)}
                        />
                        <TouchableOpacity onPress={toggleBtnSearch}>
                            <Feather style={{marginLeft: -35, marginBottom: 20}} name="search" size={24} color="#025146" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Header>
            <AddMealsSegment searchInput={searchInput} setBtnSearch={setBtnSearch} search={btnSearch ? searchInput : ""} mealName={route.params.mealName} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#025146',
        height: 210,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4
    },
    body: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        height: '100%'
    }
});

export default AddMealsScreen;