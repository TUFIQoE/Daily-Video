import {ScrollView, View} from "react-native"
import React, {useState} from "react"
import styles from "../styles/LandingStyle"
import Bullet from "../components/Bullet";
import IntroductionViewHeader from "../components/IntroductionViewHeader";
import IntroductionPagerView from "../components/IntroductionPagerView";

const Landing = ({navigation}) => {
    const [currentPage, setCurrentPage] = useState(0)

    return (
        <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
            <IntroductionViewHeader initialPage={1}/>

            <IntroductionPagerView setCurrentPage={setCurrentPage} navigation={navigation}/>

            <View style={styles.bullet_container}>
                <Bullet index={0} currentPage={currentPage}/>
                <Bullet index={1} currentPage={currentPage}/>
                <Bullet index={2} currentPage={currentPage}/>
            </View>
        </ScrollView>
    )
}


export default Landing