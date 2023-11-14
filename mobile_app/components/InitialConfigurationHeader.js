import React from "react";
import MyText from "./MyText";
import {View} from "react-native";
import styles from "../styles/InitialConfigurationStyle";


const InitialConfigurationHeader = () => {
   return(
       <React.Fragment>
           <MyText fontSize={30} style={{textAlign: "left"}}>Konfiguracja</MyText>
           <View style={styles.separator}></View>
       </React.Fragment>
   )
}


export default InitialConfigurationHeader