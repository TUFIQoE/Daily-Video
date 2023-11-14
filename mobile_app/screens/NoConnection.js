import {Image, useWindowDimensions, View} from "react-native"
import React, {useEffect} from "react"
import {Button} from "react-native-elements"
import styles from "../styles/NoConnectionStyle"
import * as Updates from "expo-updates"
import MyText from "../components/MyText";
import {COLORS} from "../styles/config";
import {useTranslation} from "react-i18next";
import {pixelSizeVertical} from "../utils/pixelRatioUtils";
import * as ScreenOrientation from "expo-screen-orientation";


const NoConnection = () => {
    const {i18n, t} = useTranslation()
    const window = useWindowDimensions()


    useEffect(() => {
        async function init(){
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP) // <-- Lock screen in portrait up orientation (part of the iOS production workaround)
        }

        init()
    }, [])

    return (
        <View style={styles.container}>
            <View style={{...styles.header, width: window.width}}>
                <Image
                    source={require("../assets/icons/error.png")}
                    style={styles.image}
                />
            </View>
            <View style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "flex-start",
                alignItems: "center"
            }}>
                <MyText fontSize={20} style={{width: "auto", textAlign: "center"}}>{t('common:no_internet_connection')}</MyText>
                <Button
                    title={t('common:try_again')}
                    onPress={async () => {
                        await Updates.reloadAsync()
                    }}
                    buttonStyle={{
                        backgroundColor: COLORS.primary
                    }}
                    containerStyle={{
                        marginTop: pixelSizeVertical(50),
                        width: window.width/2
                    }}
                />
            </View>
        </View>
    )
}


export default NoConnection