import React, {useState} from "react"


import {useTranslation} from "react-i18next";
import {COLORS, FONT} from "../styles/config"
import FontAwesome from "react-native-vector-icons/FontAwesome";



import {createDrawerNavigator} from "@react-navigation/drawer";
import {Image} from "react-native-elements/dist/image/Image";
import {fontPixel} from "../utils/pixelRatioUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import Home from "./Home";
import Settings from "./Settings/Settings";
import IssueReport from "./IssueReport"

const Root = () => {
    const {t, i18n} = useTranslation()
    const Drawer = createDrawerNavigator()

    return (
        <Drawer.Navigator
            initialRouteName={"Home"}
            screenOptions={{
                headerTitleAlign: "center",
                drawerType: "front",
                headerStyle: {
                    backgroundColor: COLORS.dark,
                },
                headerTitleContainerStyle: {
                    border: "none"
                },
                drawerLabelStyle: {
                    fontSize: fontPixel(18),
                    fontFamily: FONT,
                },
                headerTitle: "",
                headerShown: true,
                headerTintColor: "whitesmoke",
                //drawerActiveBackgroundColor: COLORS.dark,
                drawerActiveTintColor: COLORS.primary,
                sceneContainerStyle: {
                    backgroundColor: COLORS.dark
                },
            }}
        >
            <Drawer.Screen
                name={"Home"}
                component={Home}
                options={{
                    drawerIcon: (status) => {
                        return   <FontAwesome name={"home"} size={25} color={status.focused ? COLORS.primary : COLORS.dark}/>
                    },
                    drawerLabel: t('common:home')
                }}
            />
            <Drawer.Screen
                name={"Settings"}
                component={Settings}
                options={{
                    drawerIcon: (status) => {
                        return   <FontAwesome name={"gear"} size={25} color={status.focused ? COLORS.primary : COLORS.dark}/>
                    },
                    drawerLabel: t('common:settings')
                }}
            />
            <Drawer.Screen
                name={"IssueReport"}
                component={IssueReport}
                options={{
                    drawerIcon: (status) => {
                        return   <FontAwesome name={"exclamation-circle"} size={25} color={status.focused ? COLORS.primary : COLORS.dark}/>
                    },
                    drawerLabel: t('common:issue_report')
                }}
            />
        </Drawer.Navigator>
    )

}


export default Root