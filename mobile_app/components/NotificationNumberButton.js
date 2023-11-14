import React from "react"
import {Button} from "react-native-elements";
import {COLORS} from "../styles/config";
import {useDispatch, useSelector} from "react-redux";
import {setNotificationsConfig} from "../redux/actions";

const NotificationNumberButton = (props) => {
    const {notifications_config} = useSelector(state => state.userReducer)
    const dispatch = useDispatch()

    const handlePress = () => {
        const update = {...notifications_config, notificationsPerDay: props.number}
        dispatch(setNotificationsConfig(update))
    }


    return (
        <Button
            title={props.number}
            containerStyle={{
                width: 40,
                height: 50,

            }}
            buttonStyle={{
                backgroundColor: notifications_config.notificationsPerDay == props.number ? COLORS.primary : COLORS.secondary,
            }}
            titleStyle={{
                color: notifications_config.notificationsPerDay == props.number ? COLORS.light : COLORS.dark,
            }}
            onPress={handlePress}
        />
    )
}

/*

  <Button onPress={handlePress} mode={"contained"}
                style={{
                    backgroundColor: notifications_config.notificationsPerDay == props.number ? COLORS.primary : COLORS.secondary,
                    borderRadius: 100
                }}
                labelStyle={{color: notifications_config.notificationsPerDay == props.number ? COLORS.light : COLORS.dark}}
                >{props.number}</Button>
 */

export default NotificationNumberButton