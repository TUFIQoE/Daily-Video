import {Text, View} from "react-native"
import React, {useState} from "react"
import * as FileSystem from "expo-file-system"
import {Button} from "react-native-paper";
import {VIDEO_DIRECTORY} from "../../config";

const FileSystemTest = () => {
    const [progress, setProgress] = useState(null)


    const callback = downloadProgress => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
        setProgress(progress)
    }

    const downloadResumable = FileSystem.createDownloadResumable(
        "https://figlus.pl/storage/videos/batman.mp4",
        VIDEO_DIRECTORY + "/batman.mp4",
        {},
        callback
    )

    const handleDownload = async () => {
        try {
            const {uri} = await downloadResumable.downloadAsync()
            console.log('Finished downloading to ', uri);
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <View style={style}>
            <Text>FileSystem Test</Text>
            <Text>{progress}</Text>
            <Button mode={"contained"} onPress={handleDownload}>DOWNLOAD</Button>
        </View>
    )
}

const style = {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
}


export default FileSystemTest