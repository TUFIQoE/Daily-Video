import {Text, View} from 'react-native';
import React, {useEffect, useState} from "react"

import {useDispatch} from "react-redux";
import {styles} from "../../styles/CellularStyle";
import {Button} from "react-native-paper";
import {COLORS} from "../../styles/config";
import {pixelSizeVertical} from "../../utils/pixelRatioUtils";

const Cellular = ({navigation}) => {
    const dispatch = useDispatch()
    const [permission, setPermission] = useState({
        allowed: false,
        denied: false
    })

    useEffect(() => {
        // Handle AsyncStorage change
        // Also set this field in Redux state so it can be submitted to server - just in case
    }, [permission])

    const handleAllowClick = () => {
        setPermission({allowed: true, denied: false})
    }
    const handleDenyClick = () => {
        setPermission({allowed: false, denied: true})
    }


    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.header}> Pozwól aplikacji na używanie danych komórkowych w celu pobierania i
                    aktualizowania zasobów wideo.</Text>
                <Text style={styles.advice}> Zaleca się na wybrać opcję "Zezwalam" w przypadku posiadania
                    nielimitowanego planu komórkowego </Text>
            </View>
            <View style={styles.buttonBox}>
                <Button onPress={handleAllowClick} mode={"outlined"}
                        labelStyle={{color: permission.allowed === true ? "whitesmoke" : "#222222"}}
                        contentStyle={{backgroundColor: permission.allowed === true ? COLORS.success : COLORS.secondary}}> Zezwalam </Button>
                <Button style={{marginTop: pixelSizeVertical(20)}} onPress={handleDenyClick} mode={"outlined"}
                        labelStyle={{color: permission.denied === true ? "whitesmoke" : "#222222"}}
                        contentStyle={{backgroundColor: permission.denied === true ? COLORS.danger : COLORS.secondary}}> Tylko
                    Wi-Fi </Button>
            </View>

            <Button uppercase={true} mode={"contained"} color={COLORS.info}
                    icon={"check-bold"}
                    onPress={() => {

                    }}>
                Dalej
            </Button>
        </View>
    )
}


export default Cellular