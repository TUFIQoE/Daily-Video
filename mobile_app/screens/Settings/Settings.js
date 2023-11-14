import React, {useState} from "react"
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LogBox, useWindowDimensions, View} from "react-native";
import styles from "../../styles/SettingsStyle"
import MyText from "../../components/MyText";
import NotificationsSwitch from "../../components/Settings/NotificationsSwitch";
import NotificationsPicker from "../../components/Settings/NotificationsPicker";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LanguagePicker from "../../components/Settings/LanguagePicker";
import {useTranslation} from "react-i18next";
import {STORAGE_KEYS} from "../../config";
import {check_notifications} from "../../utils/test_utils/check_notifications";

const Tab = createBottomTabNavigator();

const Settings = () => {
    const {i18n, t} = useTranslation()
    const window = useWindowDimensions()
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)

    useFocusEffect( //Maybe it could be changed to useLayoutEffect ????
        React.useCallback(() => {
            async function init() {
                LogBox.ignoreLogs(['VirtualizedLists should never be nested']) //Ignoring warning related to usage of react-native-dropdown-picker inside of KeyboardAwareScrollView

                const config = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG))
                setNotificationsEnabled(config.enabled)
            }

            init()

            return async () => {
                console.log("Leaving Settings View")
                await check_notifications()
            }
        }, [])
    );


    return (
        <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.contentContainer} extraHeight={200} alwaysBounceVertical={false}>
            <View style={{...styles.header_box, width: window.width}}>
                <MyText fontSize={30} style={{textAlign: "left"}}>{t('common:settings')}</MyText>
                {
                    /*
                    <View style={styles.separator}></View>
                     */
                }

            </View>
            <NotificationsSwitch notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled}/>
            <NotificationsPicker notificationsEnabled={notificationsEnabled}/>

            <LanguagePicker/>
        </KeyboardAwareScrollView>
    )

}


export default Settings


// This is the tab navigator code - settings separated into two views, one for notifications one for language
/*
import NotificationSettings from "./NotificationSettings";
import LanguageSettings from "./LanguageSettings";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {COLORS} from "../../styles/config";

 */
/*<Tab.Navigator screenOptions={{
            headerTitleAlign: "center",
            headerShown: false,
            tabBarLabelStyle: {
                fontSize: 14,
                color: "black",
                fontWeight: "normal"
            }
        }}>
            <Tab.Screen name="NotificationSettings" component={NotificationSettings} options={{
                title: "Ustawienia powiadomień",
                tabBarIcon: ({color, focused}) => {
                    return <MaterialIcons name={"notifications"} color={focused ? COLORS.info : COLORS.dark} size={26}/>
                }
            }}/>
            <Tab.Screen name="LanguageSettings" component={LanguageSettings} options={{
                title: "Język",
                tabBarIcon: ({color, focused}) => {
                    return <MaterialIcons name={"language"} color={focused ? COLORS.info : COLORS.dark} size={26}/>
                }
            }}/>
        </Tab.Navigator>
         */