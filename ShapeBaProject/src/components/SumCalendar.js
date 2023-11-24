import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Button,
    Modal,
} from "react-native";
import React, { useState } from "react";
import DatePicker from "react-native-modern-datepicker";
import { getFormatedDate } from "react-native-modern-datepicker";


//redux
import { useDispatch, useSelector } from "react-redux";
import { calculateTDEE } from "../store/slice/processInfoSlice1";
import {
    frontEndSelector,
    setOpenStartDatePicker,
} from "../store/slice/frontEndSlice";

const Calendar = (props, { navigation }) => {

    const openStartDatePicker = props.openStartDatePicker;
    const today = new Date();
    const startDate = getFormatedDate(
        today.setDate(today.getDate()),
        "YYYY/MM/DD"
    );
    const [startedDate, setStartedDate] = useState(null);
    const [selectedDate, setselectedDate] = useState('')
    const dispatch = useDispatch();

    function handleChangeStartDate(propDate) {
        setStartedDate(propDate);
    }
    const handleOnPressStartDate = () => {
        console.log("handleOnPressStartDate", !openStartDatePicker);
        dispatch(setOpenStartDatePicker(!openStartDatePicker));
    };

    return (
        <View style={styles.container}>
            {/* input date */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={openStartDatePicker}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <DatePicker
                            mode="calendar"
                            // minimumDate={startDate}
                            maximumDate={startDate}
                            selected={startedDate}
                            onDateChanged={handleChangeStartDate}
                            onSelectedChange={(date) => {
                                setselectedDate(date);
                                props.handleOnPressStartDate(date)
                            }} // เปลี่ยนชื่อฟังก์ชันนี้
                            options={{
                                backgroundColor: "#fff",
                                textHeaderColor: "#EC744A",
                                textDefaultColor: "#000",
                                selectedTextColor: "#FFF",
                                mainColor: "#EC744A",
                                textSecondaryColor: "#000",
                                borderColor: "#fff",
                            }}
                        />

                        <TouchableOpacity onPress={handleOnPressStartDate}>
                            <Text style={{ color: "#EC744A" }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Calendar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7FB",
        alignItems: "center",
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        padding: 35,
        width: "90%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});