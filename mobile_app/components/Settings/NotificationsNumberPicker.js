import React, {useState} from "react"
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";
import {STORAGE_KEYS} from "../../config";

const NotificationsNumberPicker = (props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [items, setItems] = useState([
        {label: '1', value: 1},
        {label: '2', value: 2},
        {label: '3', value: 3},
        {label: '4', value: 4}
    ]);


    async function handleValueChange(value) {


        // Update view state
        const new_hours = []
        for (let i = 0; i < value; i++) {
            new_hours.push(props.DEFAULT_HOURS[i])
        }
        props.setHours(new_hours)

        // Update storage
        const config = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG))
        config.hours = new_hours
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG, JSON.stringify(config))
    }


    return (
        <DropDownPicker
            open={open}
            items={items}
            value={value}
            placeholder={props.hours.length.toString()}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={{
                width: 60,
                height: "50%",
            }}
            dropDownDirection={Platform.OS === "ios" ? "TOP" : "BOTTOM"}
            onChangeValue={handleValueChange}
        />
    )
}

export default NotificationsNumberPicker