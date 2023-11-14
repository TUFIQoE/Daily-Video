import React from "react"
import {Image, View} from "react-native";
import styles from "../../styles/InitialConfigSuccessStyle"
import success from '../../assets/icons/success.png'
import {useTranslation} from "react-i18next";
import {Button} from "react-native-elements";
import {COLORS, FONT} from "../../styles/config";
import MyText from "../../components/MyText";
import {pixelSizeVertical, pixelSizeHorizontal} from "../../utils/pixelRatioUtils";

const InitialConfigSuccess = ({navigation}) => {
    const {t, i18n} = useTranslation()
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Image source={success} style={styles.img}/>
                <MyText fontSize={35}>{t('initialConfiguration:success_header')}</MyText>
            </View>
            <MyText fontSize={18} style={{marginTop: pixelSizeVertical(40)}}>{t('initialConfiguration:success_paragraph')}</MyText>
            <Button
                title={t('common:next')}
                /*icon={<MaterialCommunityIcons name={"arrow-right"} color={COLORS.pr} size={25}/>}*/
                titleStyle={{fontFamily: FONT}}

                buttonStyle={{
                    backgroundColor: COLORS.primary,
                    paddingLeft: pixelSizeHorizontal(50),
                    paddingRight: pixelSizeHorizontal(50),
                    paddingTop: pixelSizeVertical(10),
                    paddingBottom: pixelSizeVertical(10)
                }}
                containerStyle={{
                    marginTop: pixelSizeVertical(100)
                }}
                onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{name: "InitialVideoDownload"}]
                    })
                }}
            />

        </View>
    )

}


export default InitialConfigSuccess
/*

 */