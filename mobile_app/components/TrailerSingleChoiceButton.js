import React from "react"
import {Button} from "react-native-elements";
import {COLORS, FONT} from "../styles/config";
import {CONFIGURATION, VIDEO_DIRECTORY, VIDEO_DOWNLOAD_PREFIX} from "../config";
import {useDispatch} from "react-redux";
import {setServiceToDisplay, setVideoToDisplay} from "../redux/actions/videoActions";
import {Image, Pressable, useWindowDimensions} from "react-native";
import {isBlankString} from "../utils/stringUtils";
import * as FileSystem from "expo-file-system"
import {useTranslation} from "react-i18next";
import {pixelSizeVertical} from "../utils/pixelRatioUtils";
import axios from "axios";

const TrailerSingleChoiceButton = (props) => {
    const dispatch = useDispatch()
    const window = useWindowDimensions()
    const {i18n, t} = useTranslation()

    async function handleTrailerChoice() {
        const filepath = VIDEO_DIRECTORY + `/${props.filename}`
        dispatch(setVideoToDisplay(filepath))
        dispatch(setServiceToDisplay(props.servicename))


        await props.navigation.reset(
            {
                index: 0,
                routes: [{name: "VideoPlayer"}]
            }
        )

    }


    return (
        <React.Fragment>
            {
                isBlankString(props.servicename) === false ?
                    // If service name is not blank string render the service logo and button to start watching video
                    <React.Fragment>
                        <Image source={props.services[props.servicename]} />
                        <Button
                            title={t('common:watch')}
                            titleStyle={{
                                fontFamily: FONT
                            }}
                            buttonStyle={{
                                backgroundColor: COLORS.primary,
                                paddingTop: pixelSizeVertical(10),
                                paddingBottom: pixelSizeVertical(10)
                            }}
                            containerStyle={{
                                width: "50%",
                                ...props.containerStyle
                            }}
                            onPress={handleTrailerChoice}
                        />
                    </React.Fragment> :
                    // If service name is blank string render default Button component
                    <Button
                        title={t('common:watch')}
                        titleStyle={{
                            fontFamily: FONT
                        }}
                        buttonStyle={{
                            backgroundColor: COLORS.primary,
                            paddingTop: pixelSizeVertical(10),
                            paddingBottom: pixelSizeVertical(10)
                        }}
                        containerStyle={{
                            width: "50%",
                            ...props.containerStyle
                        }}
                        onPress={handleTrailerChoice}
                    />
            }
        </React.Fragment>
    )
}


export default TrailerSingleChoiceButton