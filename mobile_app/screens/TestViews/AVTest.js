import {Button, Platform, View} from "react-native"
import React, {useEffect, useState} from "react"
import {Audio, Video} from "expo-av"
import * as ScreenOrientation from "expo-screen-orientation"
import {useSelector} from "react-redux";

const AVTest = () => {
    const video = React.useRef(null)
    const [status, setStatus] = useState({})
    const [landscapeMode, setLandscapeMode] = useState(false)

    const file_uri = useSelector(state => state.videoReducer.file_uri)

    Audio.setAudioModeAsync({
        playsInSilentModeIOS: true
    })

    useEffect(() => {
        async function changeOrientation() {
            await ScreenOrientation.lockAsync(
                landscapeMode ? ScreenOrientation.OrientationLock.LANDSCAPE_LEFT : ScreenOrientation.OrientationLock.PORTRAIT
            )
        }

        changeOrientation()
    }, [landscapeMode])

    return (
        <View style={style}>
            <Video
                useNativeControls={true}
                resizeMode={"contain"}
                ref={video}
                style={{
                    width: "100%",
                    height: 300
                }}
                source={{
                    uri: file_uri,
                }}
                onPlaybackStatusUpdate={(status) => {
                    //console.log(status)
                }}
                onFullscreenUpdate={async (status) => {
                    if (status.fullscreenUpdate === 1) {  // 1 -> Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
                        setLandscapeMode(true)
                    }
                    if (status.fullscreenUpdate === 3) {  // 3 -> Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
                        setLandscapeMode(false)
                    }
                    // Below code is not essential (it seems so for now) leaving it just in case.
                    /*
                    if(status.fullscreenUpdate === 3){
                        //await video.current.dismissFullscreenPlayer() // <-- not necessary
                        //await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) // <-- Essential, get back to Portrait mode after exiting Fullscreen
                    }
                     */
                }}
            />
            <View>
                <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={async () => {
                        // Force fullscreen for both iOS and Android
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                        await video.current.presentFullscreenPlayer()
                        if (Platform.OS === "ios") {
                            // On iOS flip the orientation only once
                            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
                        }
                    }}
                />
            </View>
        </View>
    )
}

const style = {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
}


export default AVTest