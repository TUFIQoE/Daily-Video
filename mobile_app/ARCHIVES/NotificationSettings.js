import {Text, View} from "react-native"
import React, {useEffect} from "react"
import styles from "../styles/NotificationsSettingsStyle"
import NotificationNumberButton from "../components/NotificationNumberButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch} from "react-redux";
import {setNotificationsConfig} from "../redux/actions";
import {STORAGE_KEYS} from "../config";

const NotificationSettings = ({navigation}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        async function init() {
            const schedule_string = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG)
            const schedule = JSON.parse(schedule_string)
            dispatch(setNotificationsConfig(schedule))
            if (!schedule) {
                console.log("Notification schedule is empty")
                return
            }
        }

        const unsubscribe = navigation.addListener("focus", () => {
            init()
        })

        return unsubscribe
    }, [navigation])


    return (
        <View style={styles.container}>
            <Text>Ustawienia powiadomień</Text>
            <View style={styles.button_container}>
                <NotificationNumberButton number={1}/>
                <NotificationNumberButton number={2}/>
                <NotificationNumberButton number={3}/>
                <NotificationNumberButton number={4}/>
            </View>

        </View>
    )

}


export default NotificationSettings