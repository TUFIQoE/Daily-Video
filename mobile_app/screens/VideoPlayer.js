import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import {Platform, useWindowDimensions, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Audio, Video} from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import {COLORS, FONT} from "../styles/config";
import PlaybackSensor from "../utils/playback_sensors/PlaybackSensor";
import AccelerometerSensor from "../utils/playback_sensors/AccelerometerSensor";
import GyroscopeSensor from "../utils/playback_sensors/GyroscopeSensor";
import {setFullscreenStatus} from "../redux/actions/videoActions";
import {Button} from "react-native-elements";
import * as Progress from 'react-native-progress'
import {getLocalDateTime, getLocalDatetimeAndTimezone} from "../utils/timeUtils";
import * as Localization from "expo-localization"
import {getDeviceInformation, getDeviceMemory} from "../utils/deviceInfo";
import * as FileSystem from "expo-file-system"
import MyText from "../components/MyText";
import {ScrollView} from "react-native";
import {API_PREFIX, CONFIGURATION} from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import handleNotificationsForUpcomingDays from "../utils/notification_utils/handleNotificationsForUpcomingDays";
import axios from "axios";
import {uploadPlaybackData} from "../utils/data_upload/uploadPlaybackData";
import clearAllNotifications from "../utils/notification_utils/clearAllNotifications";
import {setNextVideoPlaybackDay} from "../utils/video_download_utils/setNextVideoPlaybackDay";
import {useTranslation} from "react-i18next";
import setNextOverdueDataUploadDay from "../utils/video_download_utils/setNextOverdueDataUploadDay";
import getVideoSchedule from "../utils/video_download_utils/getVideoSchedule";
import {isSurveyAvailable} from "../utils/survey_utils/isSurveyAvailable";
import {setNextSurveyDay} from "../utils/video_download_utils/setNextSurveyDay";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";

const VideoPlayer = (props) => {
    const {i18n, t} = useTranslation()
    const video = React.useRef(null)
    const [landscapeMode, setLandscapeMode] = useState(false)
    const file_uri = useSelector(state => state.videoReducer.file_uri)
    const service = useSelector(state => state.videoReducer.service)
    const dispatch = useDispatch()
    const window = useWindowDimensions()
    const [finished, setFinished] = useState(false)
    const [videoAvailable, setVideoAvailable] = useState(true)
    const [resumeButtonVisible, setResumeButtonVisible] = useState(false)

    const [playbackStarted, setPlaybackStarted] = useState()


    // Timer refs
    const playbackUpdateTimerRef = useRef(null)


    // Create sensor objects
    const playbackSensor = new PlaybackSensor(video, playbackUpdateTimerRef)
    const accelerometerSensor = new AccelerometerSensor()
    const gyroscopeSensor = new GyroscopeSensor()

    const style = {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.dark
    }

    useEffect(() => {
        async function changeOrientation() {
            if (Platform.OS === "android") {
                await ScreenOrientation.lockAsync(
                    landscapeMode ? ScreenOrientation.OrientationLock.LANDSCAPE : ScreenOrientation.OrientationLock.PORTRAIT_UP
                )
            }
        }

        changeOrientation()
    }, [landscapeMode])

    // Check if video is downloaded and stored on the device
    useLayoutEffect(() => {
        async function checkVideoAvailability() {
            const result = await FileSystem.getInfoAsync(file_uri)
            console.log(result)
            if (result.exists === true && result.size > 0) {
                console.log("File exists")
                setVideoAvailable(true)
            } else {
                setVideoAvailable(false)
                console.log("File not downloaded")
            }
        }

        checkVideoAvailability()
    }, [])


    async function init() {
        console.log("[VideoPlayer] Starting")
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true
        })
        await video.current.playAsync()
        setPlaybackStarted(getLocalDatetimeAndTimezone(new Date()))
        if (Platform.OS === "android") {
            await video.current.presentFullscreenPlayer()
        }
        // Lock orientation in LANDSCAPE for both systems
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)

        // Activate sensors
        await playbackSensor.init()
        await accelerometerSensor.init()
        await gyroscopeSensor.init()

        // Update last video seen
        const filename = file_uri.substr(file_uri.lastIndexOf("/") + 1)
        await AsyncStorage.setItem("last_video_seen", filename)

        // Make resume button visible
        setTimeout(() => {
            setResumeButtonVisible(true)
        }, 3000)
    }

    async function handleFullscreenUpdate(data) {
        await playbackSensor.fullscreen_update(data.status, data.fullscreenUpdate)

        if (data.fullscreenUpdate === 1) {  // 1 -> Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
            dispatch(setFullscreenStatus("FULLSCREEN"))
            await video.current.playAsync()
            setLandscapeMode(true)
        } else if (data.fullscreenUpdate === 3) {  // 3 -> Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
            dispatch(setFullscreenStatus("NORMAL"))
            await video.current.pauseAsync()
            setLandscapeMode(false)
        }
    }

    async function handlePlaybackStatusUpdate(status) {
        if (status.didJustFinish === true) {
            // Saving finish time
            const playback_ended = getLocalDatetimeAndTimezone(new Date())

            // Kill all sensors
            playbackSensor.kill()
            accelerometerSensor.kill()
            gyroscopeSensor.kill()
            const {total_memory, free_memory} = await getDeviceMemory()

            // Prepare data to send
            const {duration_ms, ...playback_data} = playbackSensor.get_data()
            const result = {
                playback_data: playback_data,
                accelerometer_data: accelerometerSensor.get_data(),
                gyroscope_data: gyroscopeSensor.get_data(),

                device_info: getDeviceInformation(),
                playback_started: playbackStarted,
                playback_ended: playback_ended,
                timezone: Localization.timezone,
                timezone_offset: new Date().getTimezoneOffset(),
                memory_free: free_memory,
                memory_total: total_memory,
                video: file_uri.substr(file_uri.lastIndexOf("/") + 1),
                video_duration: duration_ms[0] ? duration_ms[0] : null,
                service: service
            }

            const data = {
                result: result,
                date: getLocalDatetimeAndTimezone(new Date())
            }


            // Send data
            setFinished(true)

            const survey_available_today = await isSurveyAvailable()
            if(survey_available_today === true){
                console.log("[VideoPlayer] Survey available for today. Saving data to AsyncStorage.")
                await setNextOverdueDataUploadDay(false) // Setting after each video playback
                await AsyncStorage.setItem("data_to_send", JSON.stringify(data))
            }
            else{
                console.log("[VideoPlayer] Survey UNAVAILABLE for today. Sending data immediately")
                await setNextSurveyDay(false)  // No trailer today, next chance is tomorrow
                await uploadPlaybackData(data)
            }


            // Update next_video_playback_date and reschedule notifications
            CONFIGURATION.UPDATE_NEXT_VIDEO_PLAYBACK_DAY && await setNextVideoPlaybackDay(false)
            CONFIGURATION.UPDATE_NEXT_VIDEO_PLAYBACK_DAY && await clearAllNotifications()
            CONFIGURATION.UPDATE_NEXT_VIDEO_PLAYBACK_DAY && await handleNotificationsForUpcomingDays()

            // Restore PORTRAIT_UP orientation and redirect
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
            setTimeout(() => {
                props.navigation.reset({
                    index: 0,
                    routes: [{name: "Root"}]
                })
            }, 2000)
        }
    }


    return (
        <React.Fragment>
            {
                videoAvailable === false ?
                    <ScrollView contentContainerStyle={{
                        display: "flex",
                        flexDirection: "column",
                        width: window.width,
                        paddingLeft: pixelSizeHorizontal(30),
                        paddingRight: pixelSizeHorizontal(30),
                        backgroundColor: COLORS.dark,
                        flexGrow: 1,
                        justifyContent: "center",
                        alignItems: "flex-start"
                    }} centerContent={true}>
                        <MyText fontSize={24} style={{textAlign: "left", marginBottom: 10}}>{t('common:whoops')}</MyText>
                        <MyText fontSize={18} style={{textAlign: "left"}}>{t('common:download_problem_description')}</MyText>
                        <MyText fontSize={18} style={{textAlign: "left", marginTop: 20}}>{t('common:select_another_service')}</MyText>
                        <MyText fontSize={18} style={{textAlign: "left", marginTop: 20}}>{t('common:apology')}</MyText>

                        <Button
                            title={t('common:back')}
                            buttonStyle={{
                                backgroundColor: COLORS.primary
                            }}
                            titleStyle={{
                                fontFamily: FONT
                            }}
                            containerStyle={{
                                marginTop: pixelSizeVertical(30),
                                width: "50%"
                            }}
                            onPress={async () => {
                                await AsyncStorage.removeItem("service_choice")
                                props.navigation.reset({
                                    index: 0,
                                    routes: [{name: "Root"}]
                                })
                            }}
                        />
                    </ScrollView>
                    :
                    <View style={style}>
                        {
                            finished === false ?
                                <React.Fragment>
                                    <Video
                                        useNativeControls={Platform.OS === "android" ? false : true}
                                        resizeMode={"contain"}
                                        ref={video}
                                        style={
                                            Platform.OS === "android" ? {
                                                width: window.width,      //100%
                                                height: 275,      //40%,
                                            } : {
                                                width: window.width,
                                                height: window.height
                                            }
                                        }
                                        source={{
                                            uri: file_uri,
                                        }}
                                        onLoad={init}
                                        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                                        onFullscreenUpdate={handleFullscreenUpdate}

                                    />
                                    {
                                        Platform.OS === "android" && resumeButtonVisible === true ?
                                            <Button
                                                title={t('common:resume_watching')}
                                                buttonStyle={{
                                                    backgroundColor: COLORS.primary,
                                                }}

                                                onPress={async () => {
                                                    video.current.presentFullscreenPlayer()
                                                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
                                                }}
                                            /> : null
                                    }
                                </React.Fragment> :
                                <React.Fragment>
                                    <MyText fontSize={24}
                                            style={{marginBottom: 20}}>{t('common:synchronizing')}</MyText>
                                    <Progress.Circle indeterminate={true} color={COLORS.primary} size={75}/>
                                </React.Fragment>
                        }
                    </View>
            }
        </React.Fragment>
    )
}


export default VideoPlayer
