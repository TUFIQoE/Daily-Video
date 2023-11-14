import React, {useEffect, useLayoutEffect, useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import MyText from "../components/MyText";
import {Button} from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setNextSurveyDay} from "../utils/video_download_utils/setNextSurveyDay";
import {uploadPlaybackData} from "../utils/data_upload/uploadPlaybackData";
import setNextOverdueDataUploadDay from "../utils/video_download_utils/setNextOverdueDataUploadDay";
import {getLocalDateTime, getLocalDatetimeAndTimezone} from "../utils/timeUtils";
import {useTranslation} from "react-i18next";
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";
import {useWindowDimensions, View} from "react-native";
import {COLORS, FONT} from "../styles/config";
import {getSurveyForToday} from "../utils/survey_utils/getTodaysSurvey";
import Question from "../components/Survey/Question";
import MOS from "../components/Survey/MOS";
import Qualtrics from "../components/Survey/Qualtrics";
import * as Linking from "expo-linking";
import * as Progress from "react-native-progress"
import SurveyNavigationButtonPrevious from "../components/Survey/SurveyNavigationButtonPrevious";
import SurveyNavigationButtonNext from "../components/Survey/SurveyNavigationButtonNext";
import {STORAGE_KEYS} from "../config";



const Survey = (props) => {
    const {t, i18n} = useTranslation()
    const window = useWindowDimensions()
    const [survey, setSurvey] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [started, setStarted] = useState(null)
    const [sending, setSending] = useState(false)



    useEffect(() => {
        async function init(){

            const survey = await getSurveyForToday()
            survey.forEach((item, index) => {
                item.answer = {
                    timestamp: null,
                    value: null,
                    started: null
                }
            })

            // ESSENTIAL // Move qualtrics questions to the end of list // ESSENTIAL //
            survey.push(survey.splice(survey.findIndex(v => v.type === "QUALTRICS"), 1)[0])

            setTotalPages(survey.length)
            setSurvey(survey)
            setStarted(getLocalDatetimeAndTimezone(new Date()))
            setCurrentPage(1)
        }

        init()
    }, [])


    function setQuestionRenderTimestamp(){
        try {
            if(survey[currentPage-1].answer.started == null){
                survey[currentPage-1].answer.started = getLocalDatetimeAndTimezone(new Date())
            }
        }
        catch (err){

        }
    }

    useEffect(() => {
         setQuestionRenderTimestamp()
    }, [currentPage])


    useEffect(() => {
        async function updateDataToSend(){
            console.log("SURVEY CHANGED")

            const data = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.DATA_TO_SEND))
            data.result.reply_form = {
                started: started,
                finished: getLocalDatetimeAndTimezone(new Date()),
                content: survey
            }
            await AsyncStorage.setItem(STORAGE_KEYS.DATA_TO_SEND, JSON.stringify(data))
        }

       updateDataToSend()
    }, [survey])



    async function uploadData(qualtrics=false){
        setSending(true)    // Set loading circle

        // Update last click in case of QUALTRICS
        const last_item = survey[survey.length-1]
        if(last_item.type === "QUALTRICS"){
            last_item.answer.timestamp = getLocalDatetimeAndTimezone(new Date())
        }

        const data = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.DATA_TO_SEND)) // Data saved in AsyncStorage
        data.date = getLocalDatetimeAndTimezone(new Date()) // Updating the time
        data.result.reply_form = {
            started: started,
            finished: getLocalDatetimeAndTimezone(new Date()),
            content: survey
        }

        await setNextOverdueDataUploadDay(true) // Setting this to today because the data is now complete and can be uploaded in case there was no Internet access on the first try
        await setNextSurveyDay(false)   // Standard behaviour, next chance for survey is tomorrow
        await uploadPlaybackData(data)  // Uploading the complete data

        if(qualtrics === true){
            try {
                await Linking.openURL(survey.find(item => item.type==="QUALTRICS").qualtrics_url)
            }
            catch{
                console.log("QUALTRICS_URL NOT FOUND")
            }
        }

        props.navigation.reset({
            index: 0,
            routes: [{name: "Home"}]
        })
    }

    return(
        <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: pixelSizeVertical(50), marginTop: pixelSizeVertical(20), paddingLeft: pixelSizeHorizontal(20), paddingRight: pixelSizeHorizontal(20)}} extraScrollHeight={100}>
            <MyText fontSize={30} style={{textAlign: "left", width: "100%"}}>{t('survey:header')}</MyText>
            <View style={{width: "40%", height: pixelSizeVertical(1), backgroundColor: COLORS.primary, marginTop: pixelSizeVertical(20), marginBottom: pixelSizeVertical(20)}} />

            <MyText fontSize={24} style={{textAlign: "left"}}>{t('survey:question')} {currentPage} {t('survey:of')} {totalPages}</MyText>
            {
                /* Render proper question component based on type | three types are available: TEXT | MOS | QUALTRICS*/
                survey[currentPage-1] ?
                    survey[currentPage-1].type === "TEXT" ?  <Question index={currentPage-1} survey={survey} setSurvey={setSurvey}/> :
                    survey[currentPage-1].type === "MOS" ?  <MOS index={currentPage-1} survey={survey} setSurvey={setSurvey}/> :
                    survey[currentPage-1].type === "QUALTRICS" ? <Qualtrics index={currentPage-1} survey={survey} setSurvey={setSurvey}/> : null
                : null
            }

            <View style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: pixelSizeVertical(20)}}>
            {
                survey.length > 1 && currentPage !== totalPages?
                    <View style={{width: "100%", display: "flex", flexDirection: "row", marginBottom: pixelSizeVertical(20)}}>
                        {
                            /*
                            <SurveyNavigationButtonPrevious
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                             */
                        }
                        <SurveyNavigationButtonNext
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage} totalPages={totalPages}
                        />
                    </View> : null
            }
            {
                /* Render finish button */
                currentPage === totalPages && sending === false ?
                    <Button
                        title={survey[currentPage-1].type === "QUALTRICS" ? t('survey:go_to_qualtrics') : t('common:done')}
                        buttonStyle={{
                            backgroundColor: COLORS.primary,
                            width: "100%"
                        }}
                        containerStyle={{
                            width: "100%"
                        }}
                        titleStyle={{
                            fontFamily: FONT,
                            fontSize: fontPixel(18)
                        }}
                        onPress={async () => {
                            survey[currentPage - 1].type === "QUALTRICS" ? await uploadData(true) : await uploadData(false)
                        }}
                    /> : null
            }
            {
                currentPage === totalPages && sending ? <Progress.Circle indeterminate={true} size={50} borderWidth={3} color={COLORS.primary} /> : null
            }
            </View>
        </KeyboardAwareScrollView>
    )
}



export default Survey