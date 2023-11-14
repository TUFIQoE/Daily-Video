import React from "react";
import ViewPager from "react-native-pager-view";
import {COLORS} from "../styles/config";
import MyText from "./MyText";
import {ScrollView, useWindowDimensions} from "react-native";
import {Button} from "react-native-elements";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";
import {useTranslation} from "react-i18next";


const IntroductionPagerView = (props) => {
    const window = useWindowDimensions()
    const {t, i18n} = useTranslation()

    const viewPagerStyle = {
        width: window.width,
        height: "70%",
    }

    const lastViewStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        paddingLeft: pixelSizeHorizontal(25),
        paddingRight: pixelSizeHorizontal(25)
    }

    function handlePageScroll(event) {
        const {position} = event.nativeEvent
        props.setCurrentPage(position)
    }

    return (
        <ViewPager style={viewPagerStyle} initialPage={0} onPageSelected={handlePageScroll} pageMargin={50}>
            <ScrollView key={1} contentContainerStyle={lastViewStyle} centerContent={true}>
                <MyText fontSize={24} style={{textAlign: "left"}}>{t('initialConfiguration:scr_01_para_01')}</MyText>
                <MyText fontSize={24} style={{textAlign: "left", marginTop: pixelSizeVertical(20)}}>{t('initialConfiguration:scr_01_para_02')}</MyText>
            </ScrollView>
            <ScrollView key={2} contentContainerStyle={lastViewStyle} centerContent={true}>
                <MyText fontSize={24} style={{textAlign: "left"}}>{t('initialConfiguration:scr_02_para_01')}
                </MyText>
            </ScrollView>
            <ScrollView key={3} contentContainerStyle={lastViewStyle} centerContent={true}>
                <MyText fontSize={24} style={{textAlign: "left"}}>{t('initialConfiguration:scr_03_para_01')}</MyText>
                <MyText fontSize={24} style={{textAlign: "left", marginTop: pixelSizeVertical(20)}}>{t('initialConfiguration:scr_03_para_02')}</MyText>

                <Button title={t('common:understood')}
                        buttonStyle={{backgroundColor: COLORS.primary, borderRadius: 5}}
                        containerStyle={{
                            width: "100%",
                            marginTop: pixelSizeVertical(50)
                        }}
                        onPress={() => {
                            props.navigation.reset({
                                index: 0,
                                routes: [{name: "InitialConfiguration"}]
                            })
                        }}/>
            </ScrollView>
        </ViewPager>


    )
}


export default IntroductionPagerView