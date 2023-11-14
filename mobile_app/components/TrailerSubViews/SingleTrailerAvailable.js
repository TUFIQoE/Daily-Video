import React from "react"
import {Image, useWindowDimensions, View} from "react-native";
import MyText from "../MyText";

import logo from "../../assets/icon.png";
import styles from "../../styles/TrailersStyle";
import TrailerSingleChoiceButton from "../TrailerSingleChoiceButton";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {useTranslation} from "react-i18next";

const SingleTrailerAvailable = (props) => {
    const {i18n, t} = useTranslation()
    const {width, height} = useWindowDimensions()

    function getRandomPrompt(prompts){
        return JSON.parse(prompts)[Math.floor(Math.random() * JSON.parse(prompts).length)]
    }



    const containerStyle = {
        width: width,
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        flexGrow: 1,
    }


    return (

        <View style={containerStyle}>
            <Image source={logo} style={{...styles.logo,}}/>
            <View style={{
                width: width,
                paddingLeft: pixelSizeHorizontal(20),
                paddingRight: pixelSizeHorizontal(20),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
            }}>
                <MyText fontSize={24} style={{marginBottom: 20}}>{getRandomPrompt(t('home:video_prompts'))}</MyText>

                <TrailerSingleChoiceButton
                    filename={props.schedule[0].filename}
                    date={props.schedule[0].start}
                    containerStyle={{
                        marginTop: pixelSizeVertical(50)
                    }}
                    navigation={props.navigation}
                    servicename={props.schedule[0].service_name}
                    services={props.services}
                />
            </View>

        </View>
    )
}


export default SingleTrailerAvailable