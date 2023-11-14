import {Image, ScrollView, useWindowDimensions, View} from "react-native"
import React, {useState} from "react"
import styles from "../styles/TrailersStyle"
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import logo from "../assets/icon.png"
import MyText from "../components/MyText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSelector} from "react-redux";
import {useFocusEffect} from "@react-navigation/native";
import VideoDownload from "../components/TrailerSubViews/VideoDownload";
import MultipleTrailersAvailable from "../components/TrailerSubViews/MultipleTrailersAvailable";
import SingleTrailerAvailable from "../components/TrailerSubViews/SingleTrailerAvailable";
import TrailerUnavailable from "../components/TrailerSubViews/TrailerUnavailable";
import {API_PREFIX, CONFIGURATION, STORAGE_KEYS, VERSION} from "../config";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";
import TrailerNotScheduled from "../components/TrailerSubViews/TrailerNotScheduled";
import {getTodaysVideoSchedule} from "../utils/schedule_utils/getTodaysVideoSchedule";
import {isTodaysVideoScheduleEmpty} from "../utils/schedule_utils/isTodaysVideoScheduleEmpty";

const seedrandom = require('seedrandom')

const Trailers = (props) => {
    const window = useWindowDimensions()
    const {t, i18n} = useTranslation()
    const [dailyAllowed, setDailyAllowed] = useState(true)
    const [schedule, setSchedule] = useState([])
    const [services, setServices] = useState({})

    const [allLoaded, setAllLoaded] = useState(false)

    const {download_state} = useSelector(state => state.videoReducer)

    useFocusEffect(
        React.useCallback(() => {
            let isSubscribed = true

            async function prepare_schedule() {
                const is_allowed = new Date().setHours(0, 0, 0, 0) >= new Date(JSON.parse(await AsyncStorage.getItem("next_video_playback_day"))).setHours(0, 0, 0, 0)
                isSubscribed && setDailyAllowed(is_allowed)

                /*
                 const storage_schedule = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.VIDEO_SCHEDULE))
                const todays_schedule = []
                storage_schedule.forEach(item => {
                    if (new Date(item.start).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
                        todays_schedule.push(item)
                    }
                })
                 */
                const todays_schedule = await   getTodaysVideoSchedule()
                isSubscribed && setSchedule(todays_schedule)
            }

            async function prepare_services() {
                const LOGOS = [
                    require("../assets/service_logos/cinema_go.png"),
                    require("../assets/service_logos/connect_premium.png"),
                    require("../assets/service_logos/moovie_moovie.png"),
                    require("../assets/service_logos/my_tv.png"),
                    require("../assets/service_logos/video_today.png"),
                    require("../assets/service_logos/night_owl.png"),
                    require("../assets/service_logos/record_tv.png"),
                    require("../assets/service_logos/watch_n_chill.png")
                ]
                const SERVICES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']   // There will be more services
                let logos_pool = LOGOS.slice()
                let service_map = {}

                const MyRandom = seedrandom(await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN))


                for (let i = 0; i < SERVICES.length; i++) {
                    const logo_index = Math.floor(MyRandom() * logos_pool.length)
                    service_map = {
                        ...service_map,
                        [SERVICES[i]]: logos_pool[logo_index]
                    }
                    logos_pool.splice(logo_index, 1)
                }

                // Update services state
                isSubscribed && setServices(service_map)
            }


            Promise.all([prepare_schedule(), prepare_services()]).then(() => {
                isSubscribed && setAllLoaded(true)
            })


            return () => {
                console.log("Leaving Trailer view")
                isSubscribed = false
            }
        }, [props.navigation])
    )


    return (
        <ScrollView contentContainerStyle={{...styles.container}} centerContent={true}>
            <MyText fontSize={12} style={{textAlign: "left"}}>
                {
                    API_PREFIX.includes("dev") ? VERSION : ``
                }
            </MyText>
            {
                allLoaded ?
                    <React.Fragment>
                        <Image source={logo} style={{...styles.logo, display: "none"}}/>
                        {
                            //(download_state && dailyAllowed) ? <VideoDownload/> : null
                        }
                        {
                            (download_state === false && schedule.length === 1 && dailyAllowed) ?
                                <SingleTrailerAvailable schedule={schedule} navigation={props.navigation}
                                                        services={services}/> : null
                        }
                        {
                            (!download_state && schedule.length > 1 && dailyAllowed) ?
                                <MultipleTrailersAvailable schedule={schedule} navigation={props.navigation}
                                                           services={services}/> : null
                        }
                        {
                            !download_state && schedule.length === 0 ? <TrailerNotScheduled/> : null
                        }
                        {
                            !dailyAllowed ? <TrailerUnavailable/> : null
                        }
                    </React.Fragment> : null
            }
        </ScrollView>
    )
}

export default Trailers