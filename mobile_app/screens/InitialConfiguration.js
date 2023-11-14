import React, {useRef, useState} from 'react'
import ViewPager from "react-native-pager-view";
import MyText from "../components/MyText";
import {useWindowDimensions, View} from "react-native";
import styles from "../styles/InitialConfigurationStyle"
import {LinearProgress} from "react-native-elements";
import {COLORS} from "../styles/config";

import Language from "../components/InitialConfiguration/Language";
import General from "../components/InitialConfiguration/General";
import NotificationsInitial from "../components/InitialConfiguration/NotificationsInitial";

import {useTranslation} from "react-i18next";
import {pixelSizeHorizontal} from "../utils/pixelRatioUtils";

const InitialConfiguration = (props) => {
    const window = useWindowDimensions()
    const [progress, setProgress] = useState(0)
    const MAXPAGES = 3
    const {t, i18n} = useTranslation()
    const [scrollEnabled, setScrollEnabled] = useState(true)
    const viewPagerRef = useRef()

    function handleProgress(e) {
        const newPage = e.nativeEvent.position
        const nextPage = e.nativeEvent.position + 1
        const progress = nextPage / MAXPAGES
        setProgress(progress)


        if (newPage === 1) {
            setScrollEnabled(false)
        } else {
            setScrollEnabled(true)
        }
    }

    function navigateToPage(number) {
        viewPagerRef.current?.setPage(number)
    }


    return (
        <View style={{...styles.container, width: window.width}}>
            <MyText fontSize={30} style={{textAlign: "left", marginTop: pixelSizeHorizontal(30)}}>{t('common:configuration')}</MyText>
            <View style={styles.separator}></View>

            <ViewPager initialPage={0} style={styles.pagerView} onPageSelected={handleProgress}
                       scrollEnabled={false} pageMargin={50} ref={viewPagerRef}>
                <View key={"0"}>
                    <Language navigateToPage={navigateToPage}/>
                </View>
                <View key={1}>
                    <NotificationsInitial navigateToPage={navigateToPage}/>
                </View>
                <View key={"2"}>
                    <General navigation={props.navigation} navigateToPage={navigateToPage}/>
                </View>
            </ViewPager>

            {
                /*
                 <LinearProgress
                value={progress}
                variant="determinate"
                color={COLORS.primary}
                    />
                 */
            }

        </View>
    )
}


export default InitialConfiguration




