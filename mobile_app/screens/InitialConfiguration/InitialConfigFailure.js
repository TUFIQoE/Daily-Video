import React from "react"
import {Image, useWindowDimensions, View} from "react-native";
import styles from "../../styles/InitialConfigFailureStyle"
import {useTranslation} from "react-i18next";

import img from "../../assets/icons/error_danger.png"
import {Button} from "react-native-elements";
import {COLORS, FONT} from "../../styles/config";
import MyText from "../../components/MyText";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";

const InitialConfigFailure = ({navigation}) => {
    const {t, i18n} = useTranslation()
    const window = useWindowDimensions()
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Image source={img} style={styles.img}/>
                <View style={{display: "flex", flexDirection: "column", alignItems: "center", width: window.width}}>
                    <MyText fontSize={30}>{t('initialConfiguration:failure_header')}</MyText>
                    <MyText fontSize={18} style={{marginTop: pixelSizeVertical(20)}}>{t('initialConfiguration:failure_paragraph')}</MyText>
                </View>
            </View>


            <Button
                title={t('common:repeat')}
                iconPosition={"right"}
                iconContainerStyle={{
                    marginLeft: pixelSizeHorizontal(100)
                }}
                /*
                icon={<MaterialCommunityIcons name={"refresh"} color={COLORS.light} size={25}/>}
                 */
                containerStyle={{
                    width: "50%"
                }}
                titleStyle={{
                    color: COLORS.light,
                    fontFamily: FONT
                }}
                buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: COLORS.danger
                }}

                onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{name: "InitialConfiguration"}]
                    })
                }}
            />

        </View>
    )
}

export default InitialConfigFailure