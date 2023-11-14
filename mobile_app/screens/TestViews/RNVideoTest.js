import React, {useRef} from "react"
import Video from 'react-native-video'
import * as FileSystem from 'expo-file-system'

const RNVideoTest = () => {
    const ref = useRef()

    return (

        <Video
            source={{uri: FileSystem.documentDirectory + "/batman.mp4"}}
            ref={(ref) => {
                this.player = ref
            }}
            resizeMode={"contain"}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            }}
        />

    )

}


export default RNVideoTest