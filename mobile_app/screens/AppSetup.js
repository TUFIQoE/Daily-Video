import React, {useRef, useState} from "react";
import axios from "axios";
import {useEffect} from "react";
import {useWindowDimensions, View} from "react-native";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";
import {COLORS} from "../styles/config";
import * as Progress from "react-native-progress"
import MyText from "../components/MyText";
import {updateAppState} from "../utils/appStateUpdateUtils";
import {Animated} from "react-native";
import {useTranslation} from "react-i18next";

const AppSetup = (props) => {
    const fadeoutAnimation = useRef(new Animated.Value(0.99)).current
    const {t, i18n} = useTranslation()
    const [text, setText] = useState(["loading", "synchronization"][Math.floor(Math.random()*2)])

    useEffect(() => {
        let mounted = true
        async function init() {
            await updateAppState()

            Animated.timing(
                fadeoutAnimation,
                {
                    toValue: 0.05,
                    duration: 1000,
                    useNativeDriver: true
                }
            ).start()

            setTimeout(async () => {
                await props.navigation.reset(
                    {
                        index: 0,
                        routes: [{name: "Root"}]
                    }
                )
            }, 1000)
        }
        init()

        return () => {
            mounted = false
        }
    }, [])


    const style = {
        padding: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        backgroundColor: "#222222",
        paddingBottom: pixelSizeVertical(50),
        paddingTop: pixelSizeVertical(50)
    }

    return (
        <View style={style}>
                <Animated.View style={{opacity: fadeoutAnimation, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                    <MyText fontSize={24} style={{marginBottom: pixelSizeVertical(30)}}>{t(`common:${text}`)}...</MyText>
                    <Progress.CircleSnail
                        indeterminate={true}
                        thickness={5}
                        size={pixelSizeHorizontal(120)}
                        color={COLORS.primary}
                    />
                </Animated.View>
        </View>
    )
}

export default AppSetup