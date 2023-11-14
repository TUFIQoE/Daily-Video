import React from "react"
import {TextInput} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {setNotificationsConfig} from "../redux/actions";

const NotificationHourInput = (props) => {
    const {notifications_config} = useSelector(state => state.userReducer)
    const dispatch = useDispatch()

    const handleChange = (text) => {
        // Check for number
        if (isNaN(text) === true) {
            return
        }
        // Check if hour is valid
        if (parseInt(text) >= 24 || parseInt(text) < 0) {
            return
        }
        const arr = notifications_config.hours
        arr[props.index] = text
        const update = {
            ...notifications_config,
            hours: arr
        }
        dispatch(setNotificationsConfig(update))
    }
    return (
        <TextInput
            mode={"outlined"}
            outlineColor={"#222222"}
            dense={true}
            style={{
                width: "40%",
                textAlign: "center"
            }}
            keyboardType={"numeric"}
            value={notifications_config.hours[props.index].toString()}
            onChangeText={handleChange}
        />
    )
}


export default NotificationHourInput