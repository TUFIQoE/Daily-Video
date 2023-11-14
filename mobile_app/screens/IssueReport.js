import {Platform, Pressable, TextInput, useWindowDimensions, View} from "react-native"
import React, {useEffect, useRef, useState} from "react"
import styles from "../styles/IssueReportStyle"
import MyText from "../components/MyText";
import {COLORS, FONT} from "../styles/config";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Button} from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_PREFIX, STORAGE_KEYS} from "../config";
import axios from "axios";
import {isBlankString} from "../utils/stringUtils";
import {getLocalDateTime, getLocalDatetimeAndTimezone} from "../utils/timeUtils";
import {useFocusEffect} from "@react-navigation/native";
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";
import {useTranslation} from "react-i18next";

const IssueReport = () => {
    const {i18n, t} = useTranslation()
    const window = useWindowDimensions()
    const [report, setReport] = useState("")
    const [sent, setSent] = useState(false)

    const textInputRef = useRef(null)

    function handleReportChange(text) {
        setReport(text)
    }


    useFocusEffect(
        React.useCallback(() => {
            try{
                setSent(false)
                textInputRef?.current.focus()
            }
            catch (err){
                console.log(err)
            }


            return () => {

            }
        }, [])
    );


    async function submit() {
        const comment = report
        const date = getLocalDatetimeAndTimezone(new Date()) // local datetime of sending event
        const video = await AsyncStorage.getItem("last_video_seen") ?? "NO_VIDEO_HAS_BEEN_SEEN_YET"

        const data = {
            comment: comment,
            date: date,
            video: video
        }
        console.log(data)
        const url = API_PREFIX + "/feedback-comments/"
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        const config = {
            headers: {
                Authorization: `Token ${token}`
            }
        }
        axios.post(url, data, config)
            .then((res) => {
                console.log(res.status)
                setSent(true)
                setReport("")
                /*
                 setTimeout(() => {
                     setSent(false)
                 }, 3000)
                 */
            })
            .catch((err) => {
                console.log(err.response.status)
                console.log(err.response.data)
            })
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} centerContent={true}>
            <View style={{...styles.box, width: window.width}}>
                <MyText fontSize={30} style={{width: "auto"}}>{t('issue_report:header')}</MyText>
                <View style={styles.separator}></View>
            </View>

            <View style={{...styles.box, width: window.width}}>
                <MyText fontSize={sent ? 24 : 18} style={{
                    textAlign: 'left',
                    maxWidth: "90%"
                }}>{sent ? t('issue_report:issue_sent_header') : t('issue_report:description')}</MyText>
                {
                    sent ?
                        <React.Fragment>
                            <MyText fontSize={18} style={{textAlign: "left", marginTop: pixelSizeVertical(10)}}>{t('issue_report:team_handles')}</MyText>
                            {
                                /*
                                    <Button title={"Wyślij kolejną wiadomość"}
                                            buttonStyle={{
                                        backgroundColor: COLORS.primary
                                        }}
                                        containerStyle={{
                                            marginTop: 20,
                                            alignSelf: "flex-start"
                                        }}
                                        onPress={() => {
                                            setSent(false)
                                        }}
                                    />
                                 */
                            }
                        </React.Fragment>
                        :
                        <TextInput
                            multiline={true}
                            numberOfLines={1}
                            ref={textInputRef}
                            style={{
                                width: "100%",
                                backgroundColor: COLORS.light,
                                minHeight: 100,
                                maxHeight: 200,
                                borderRadius: 5,
                                paddingTop: pixelSizeVertical(10),
                                paddingBottom: pixelSizeVertical(10),
                                paddingLeft: pixelSizeHorizontal(10),
                                paddingRight: pixelSizeHorizontal(10),
                                marginTop: pixelSizeVertical(25),
                                textAlignVertical: "top"
                            }}
                            keyboardType={"default"}
                            placeholder={t('issue_report:message_content')}
                            onChangeText={handleReportChange}
                        />
                }

            </View>
            <View style={{
                marginTop: pixelSizeVertical(50),
                width: window.width,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                paddingLeft: pixelSizeHorizontal(20),
                paddingRight: pixelSizeHorizontal(20)
            }}>
                {
                    sent ? null :
                        <Button
                            title={t('issue_report:send')}
                            buttonStyle={{
                                backgroundColor: COLORS.primary,
                                paddingLeft: pixelSizeHorizontal(40),
                                paddingRight: pixelSizeHorizontal(40),
                                paddingTop: Platform.OS === "ios" ? 15 : 10,
                                paddingBottom: Platform.OS === "ios" ? 15 : 10,
                            }}
                            titleStyle={{
                                fontFamily: FONT,
                                fontSize: fontPixel(16)
                            }}
                            containerStyle={{}}

                            onPress={submit}
                            disabled={isBlankString(report)}
                            disabledStyle={{
                                backgroundColor: COLORS.secondary,
                                opacity: 0.5
                            }}
                            disabledTitleStyle={{
                                color: COLORS.dark
                            }}
                        />
                }
            </View>
            {
                /*
                <Pressable style={{position: "absolute", bottom: 20}}>
                <MyText fontSize={16} >Kontakt: kontakt.dailytrailer@gmail.com</MyText>
                </Pressable>
                */
            }


        </KeyboardAwareScrollView>
    )
}


export default IssueReport