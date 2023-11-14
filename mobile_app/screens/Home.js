import React, {useState} from "react";
import MyText from "../components/MyText";

import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaView, ScrollView, useWindowDimensions, View} from "react-native";
import Trailers from "./Trailers";
import Survey from "./Survey";
import TrailerUnavailable from "../components/TrailerSubViews/TrailerUnavailable";
import {setNextSurveyDay} from "../utils/video_download_utils/setNextSurveyDay";
import {setNextVideoPlaybackDay} from "../utils/video_download_utils/setNextVideoPlaybackDay";

const Home = (props) => {
    const [component, setComponent] = useState("Home")

    //setNextVideoPlaybackDay(true); setNextSurveyDay(true);


    useFocusEffect(
        React.useCallback(() => {

            async function select_home_component(){
                const next_survey_day = new Date(JSON.parse(await AsyncStorage.getItem("next_survey_day"))).setHours(0,0,0,0)
                const next_video_playback_day = new Date(JSON.parse(await AsyncStorage.getItem("next_video_playback_day"))).setHours(0,0,0,0)
                const today = new Date().setHours(0,0,0,0)

                if(today >= next_video_playback_day){
                    setComponent("Trailers")
                }
                else{
                    if(today >= next_survey_day){
                        setComponent("Survey")
                    }
                    else{
                        setComponent("TrailerUnavailable")
                    }
                }
            }

            select_home_component()

            return () => {
                console.log("Leaving Home Component")
            }
        }, [])
    )

    return(
        <>
            {
                component === "Trailers" ? <Trailers navigation={props.navigation}/> : null
            }
            {
                component === "Survey" ? <Survey navigation={props.navigation}/> : null
            }
            {
                component === "TrailerUnavailable" ? <TrailerUnavailable/> : null
            }
        </>

    )
}

export default Home