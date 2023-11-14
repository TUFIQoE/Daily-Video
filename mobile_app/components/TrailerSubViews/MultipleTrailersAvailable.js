import React, {useState} from "react"
import MyText from "../MyText";
import {useWindowDimensions, View} from "react-native";
import {Button} from "react-native-elements";
import {COLORS, FONT} from "../../styles/config";
import {useFocusEffect} from "@react-navigation/native";
import TrailerMultipleChoiceButton from "../TrailerMultipleChoiceButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {useSelector} from "react-redux";
import {CONFIGURATION} from "../../config";
import {useTranslation} from "react-i18next";

const MultipleTrailersAvailable = (props) => {
    const {i18n, t} = useTranslation()
    const {width, height} = useWindowDimensions()
    const [choice, setChoice] = useState({})
    const [dailyServiceChoice, setDailyServiceChoice] = useState(null)
    const serviceToDisplay = useSelector(state => state.videoReducer.service)

    const containerStyle = {
        width: width,
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,

    }
    const boxStyle = {
        maxWidth: width,
        flexWrap: "wrap",
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: pixelSizeVertical(50)
    }

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true
            async function init() {
                const storage_service_choice = JSON.parse(await AsyncStorage.getItem("service_choice"))
                // Check if the service_choice was set at all
                if(storage_service_choice != null){
                    // Compare dates, update view only if the set date matches current day
                    isMounted && (new Date().setHours(0,0,0,0) === new Date(storage_service_choice.date).setHours(0,0,0,0) ? setDailyServiceChoice(storage_service_choice) : null)
                }
            }

            init()
            return () => {
                isMounted = false
            }
        }, [])
    );

    function returnAllServices(){
        return props.schedule.map((video, index) => {
            return (
                <TrailerMultipleChoiceButton
                    key={index}

                    index={index}
                    filename={video.filename}
                    date={video.start}
                    navigation={props.navigation}
                    servicename={video.service_name}
                    services={props.services}
                    choice={choice}
                    setChoice={setChoice}
                />
            )
        })
    }


    async function navigateToPlayer() {
        // Update service_choice in AsyncStorage
        if(CONFIGURATION.SAVE_SERVICE_CHOICE === true){
            const service_choice = {
                service_name: serviceToDisplay,
                date: new Date()
            }
            await AsyncStorage.setItem("service_choice", JSON.stringify(service_choice))
        }

        // Navigate to the video player view
        props.navigation.reset(
            {
                index: 0,
                routes: [{name: "VideoPlayer"}]
            }
        )
    }

    return (
        <View style={containerStyle}>
            <MyText fontSize={24} style={{paddingLeft: 30, paddingRight: 30}}>{t('home:service_select_header')}</MyText>
            <View style={boxStyle}>
                {
                    dailyServiceChoice == null ?
                        <React.Fragment>
                            {
                                returnAllServices()
                            }
                        </React.Fragment> :
                        <React.Fragment>
                            {
                                props.schedule.find(video => video.service_name === dailyServiceChoice.service_name) !== undefined ? props.schedule.map((video, index) => {
                                    if(video.service_name === dailyServiceChoice.service_name){
                                        return(
                                            <React.Fragment key={index}>
                                                <MyText fontSize={16} >{t('home:service_already_selected')}</MyText>
                                                <TrailerMultipleChoiceButton
                                                    key={index}
                                                    index={index}
                                                    filename={video.filename}
                                                    date={video.start}
                                                    navigation={props.navigation}
                                                    servicename={video.service_name}
                                                    services={props.services}
                                                    choice={choice}
                                                    setChoice={setChoice}
                                                />
                                            </React.Fragment>
                                        )
                                    }
                                }) : returnAllServices()
                            }
                        </React.Fragment>
                }

            </View>
            <Button
                title={t('common:watch')}
                titleStyle={{
                    fontFamily: FONT,
                    fontSize: fontPixel(18)
                }}
                disabled={!("index" in choice)}
                buttonStyle={{
                    backgroundColor: COLORS.primary,
                }}
                containerStyle={{
                    width: "50%",
                    marginTop: pixelSizeVertical(30)
                }}
                disabledStyle={{
                    backgroundColor: COLORS.secondary
                }}
                disabledTitleStyle={{
                    color: COLORS.light
                }}
                onPress={navigateToPlayer}
            />
        </View>
    )
}

export default MultipleTrailersAvailable



