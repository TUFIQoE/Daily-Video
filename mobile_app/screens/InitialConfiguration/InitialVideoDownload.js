import React, {useEffect, useState} from "react"
import * as FileSystem from "expo-file-system"
import {FileSystemSessionType} from "expo-file-system"
import {Alert, View} from "react-native";
import {VIDEO_DIRECTORY, VIDEO_DOWNLOAD_PREFIX} from "../../config";
import {pixelSizeVertical} from "../../utils/pixelRatioUtils";

import {Button, LinearProgress} from "react-native-elements";
import styles from "../../styles/InitialVideoDownloadStyle"
import getVideoSchedule from "../../utils/video_download_utils/getVideoSchedule";
import MyText from "../../components/MyText";
import {COLORS, FONT} from "../../styles/config";
import axios from "axios";
import {reportVideoUnavailable} from "../../utils/video_download_utils/reportVideoUnavailable";
import {useTranslation} from "react-i18next";
import * as Filesystem from "expo-file-system";

const InitialVideoDownload = (props) => {
    const [completed, setCompleted] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const {t, i18n} = useTranslation()


    useEffect(() => {
        if(showAlert === true){
            Alert.alert('Alert Title', 'My Alert Msg', [
                {
                    text: 'Ask me later',
                    onPress: () => console.log('Ask me later pressed'),
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    }, [showAlert])

    useEffect(() => {
        async function downloadVideos() {
            const schedule = await getVideoSchedule(5)
            const promises = schedule.map(async video => {
                try{
                    const result = await axios.head(video.url)  // <-- HEAD request to check if file is available at the remote
                    if(result.status !== 404){
                        // Check if there is enough storage space
                        const content_length = result.headers["content-length"]
                        const free_space = await Filesystem.getFreeDiskStorageAsync()
                        if(free_space < content_length){
                            console.log("Not enough space on the device")
                            return
                        }

                       await FileSystem.downloadAsync(video.url, VIDEO_DIRECTORY + `/${video.filename}`, {
                            sessionType: FileSystemSessionType.BACKGROUND
                        })
                            .then((res) => {
                                // This block is executed after the download promise is resolved
                                console.log(`Finished writing to ${res.uri}`)
                            })
                            .catch((err) => {
                                console.log(err)
                                console.log("An error occured")
                            })
                    }
                }
                catch (err){
                    if(err.response.status === 404){
                        console.log("Resources not available at the remote server")
                        await reportVideoUnavailable(video.file)
                    }
                    else{
                        console.log(err)
                    }
                }
            })
            Promise.all(promises).then(() => {
                // This executes after all promises are resolved
                console.log("All files downloaded")
                setCompleted(true)
            })}downloadVideos()
    }, [])



    return (
        <View style={styles.container}>
            <MyText fontSize={30}>{completed === false ? t('initialConfiguration:video_download_progress_header') : t('initialConfiguration:video_download_done_header')}</MyText>
            <View style={styles.progressBarBox}>
                {
                    completed === false ?
                        <LinearProgress
                            variant="indeterminate"
                            color={COLORS.primary}
                            style={{
                                height: 10,
                                borderRadius: 10
                            }}/> : <MyText fontSize={24}>{t('initialConfiguration:video_download_done_paragraph')}</MyText>
                }
                {
                    completed === false ?
                        <MyText fontSize={24} style={{marginTop: pixelSizeVertical(60)}}>{t('initialConfiguration:video_download_progress_paragraph')}</MyText> :
                        <Button
                            title={t('common:next')}
                            titleStyle={{fontFamily: FONT}}
                            buttonStyle={{backgroundColor: COLORS.primary}}

                            containerStyle={{
                                marginTop: pixelSizeVertical(60),
                                width: "50%",
                            }}
                            onPress={() => {
                                props.navigation.reset({
                                    index: 0,
                                    routes: [{name: "Root"}]
                                })
                            }}
                        />
                }

            </View>
        </View>
    )
}

export default InitialVideoDownload


/* This code is also correct but the above look better :)
            for(let i=0; i<schedule.length; i++){
                const video = schedule[i]
                const url = VIDEO_DOWNLOAD_PREFIX + "/" + video.filename
                const p = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + video.filename, {
                    sessionType: FileSystemSessionType.BACKGROUND
                }).then(console.log("HELLO"))
                promises.push(p)
            }
*/