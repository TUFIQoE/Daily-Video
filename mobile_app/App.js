import React, {useEffect, useRef, useState} from 'react';
import {Raleway_400Regular, Raleway_600SemiBold, useFonts} from "@expo-google-fonts/raleway";
import * as SplashScreen from 'expo-splash-screen'
import * as Network from "expo-network"
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Provider} from "react-redux"
import {Store} from "./redux/store";
import {COLORS} from "./styles/config";
import * as Notifications from "expo-notifications"
import AsyncStorage from '@react-native-async-storage/async-storage';
import './IMLocalize'
import Root from "./screens/Root";
import Landing from "./screens/Landing";
import NoConnection from "./screens/NoConnection";
import InitialConfigFailure from "./screens/InitialConfiguration/InitialConfigFailure";
import InitialConfigSuccess from "./screens/InitialConfiguration/InitialConfigSuccess";
import clearAllNotifications from "./utils/notification_utils/clearAllNotifications";
import handleNotificationsForTheDay from "./utils/notification_utils/handleNotificationsForTheDay";
import InitialVideoDownload from "./screens/InitialConfiguration/InitialVideoDownload";
import InitialConfiguration from "./screens/InitialConfiguration";
import {Platform, StatusBar} from "react-native";
import downloadVideosOnAppLoading from "./utils/video_download_utils/downloadVideosOnAppLoading";
import VideoPlayer from "./screens/VideoPlayer";
import * as FileSystem from "expo-file-system"
import {API_PREFIX, CONFIGURATION, STORAGE_KEYS, VIDEO_DIRECTORY} from "./config";
import deleteObsoleteVideos from "./utils/video_download_utils/videoDelete";
import {AppState} from "react-native";
import AppSetup from "./screens/AppSetup";

// Test views
import FileSystemTest from "./screens/TestViews/FileSystemTest";
import AVTest from "./screens/TestViews/AVTest";
import {useTranslation} from "react-i18next";
import createVideoDirectory from "./utils/video_download_utils/createVideoDirectory";
import handleNotificationsForUpcomingDays from "./utils/notification_utils/handleNotificationsForUpcomingDays";
import {handleOverdueData} from "./utils/data_upload/uploadPlaybackData";
import {check_notifications} from "./utils/test_utils/check_notifications";
import {check_async_storage} from "./utils/test_utils/check_async_storage";
import {check_video_files} from "./utils/test_utils/check_video_files";
import {checkOnBackgroundToForeground} from "./utils/appStateUpdateUtils";
import {setLastVisited, updateAppState} from "./utils/appStateUpdateUtils";
import {navigationRef} from "./RootNavigation";
import Blackness from "./screens/Blackness";
import * as ScreenOrientation from "expo-screen-orientation";
import i18next from "i18next";
import setNextOverdueDataUploadDay from "./utils/video_download_utils/setNextOverdueDataUploadDay";
import {setNextVideoPlaybackDay} from "./utils/video_download_utils/setNextVideoPlaybackDay";
import axios from "axios";
import * as Crypto from "expo-crypto";
import {CryptoEncoding} from "expo-crypto";
import ServerError from "./screens/ServerError";
import {removeWhitespaces} from "./utils/stringUtils";


function App() {
    const {t, i18n} = useTranslation()
    const [appIsReady, setAppIsReady] = useState(false)
    const Stack = createNativeStackNavigator()
    const [initialView, setInitialView] = useState("")
    const [fontsLoaded] = useFonts({
        Raleway_600SemiBold,
        Raleway_400Regular
    })
    const appState = useRef(AppState.currentState)


    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });



    // This is code responsible for displaying splash screen as long as app is loading/fetching external data
    useEffect(() => {
        async function prepare() {
            try {
                CONFIGURATION.DELETE_ALL_VIDEOS && await FileSystem.deleteAsync(VIDEO_DIRECTORY)
                CONFIGURATION.LOGOUT && await AsyncStorage.clear()

                StatusBar.setBarStyle('light-content') // <-- Make the hour, battery, network etc. indicators light coloured, so they are visible on dark background
                await SplashScreen.preventAutoHideAsync(); // <-- remain splash screen visible
                await createVideoDirectory() // <-- this directory has to be created before user's initial configuration
                await setLastVisited()
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP) // <-- Lock screen in portrait up orientation (part of the iOS production workaround)


                // Check network status
                const network = await Network.getNetworkStateAsync()
                if (network.isConnected === true && network.isInternetReachable === true) {
                    try {
                        const access_token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
                        if (access_token) {
                            setInitialView("AppSetup")
                            // Check server reachability by logging in //
                            const f_name = removeWhitespaces(await AsyncStorage.getItem(STORAGE_KEYS.USER_FIRST_NAME))
                            const l_name = removeWhitespaces(await AsyncStorage.getItem(STORAGE_KEYS.USER_LAST_NAME))
                            const phone_number = removeWhitespaces(await AsyncStorage.getItem(STORAGE_KEYS.PHONE_NUMBER))

                            const salt = 'your-salt-here'
                            const external_id = await Crypto.digestStringAsync(
                                Crypto.CryptoDigestAlgorithm.SHA256,
                                `${f_name}${l_name}${phone_number}${salt}`,
                                {
                                    encoding: CryptoEncoding.HEX
                                }
                            )
                            const data = {
                                external_id: external_id
                            }
                           try{
                               const response = await axios.post(API_PREFIX + "/users/token/login/", data)
                               console.log(response.status)
                               // if response is returned then ok
                           }
                           catch (err){
                                console.log(err)
                               // if response not returned, then server most likely does not work --> API closed, or login endpoint corrupted
                                setInitialView("ServerError")
                           }

                            // Proceed with all processes for authenticated user
                            //await updateAppState()

                            // Run tests
                            //await check_notifications()
                            //await check_async_storage()
                            //await check_video_files()

                        } else {
                            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP) // <-- Lock screen in portrait up orientation (part of the iOS production workaround)
                            setInitialView("Landing")
                        }
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    console.log("No Internet Connection")
                    setInitialView("NoConnection")
                }
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
                await SplashScreen.hideAsync() // <-- Hiding SplashScreen
            }
        }

        // Listen for application returning from background to foreground
        // This is an experimental thing. Will be used later
        AppState.addEventListener("change", async (nextAppState) => {

            if (appState.current.match(/inactive|background/) && nextAppState === "active"){
                await checkOnBackgroundToForeground()
            }
            if(nextAppState === "background" || nextAppState === "inactive"){   // update on inactive state is necessary for iOS!
                await setLastVisited()
            }
            appState.current = nextAppState
        })
        prepare();

        // This is called when App component unmounts --> because of the empty [] brackets as second argument
        // Though App component unmount only when app is terminated, going to background does not unmount App
        return () => {
            console.log("Exiting")
        }
    }, []);



    if (!appIsReady || !fontsLoaded) {
        return null;
    }
    return (
        <Provider store={Store}>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator initialRouteName={initialView} screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.dark,
                    },
                    headerShown: true,
                    headerTintColor: "#ffffff",
                    headerTitle: "",
                    headerTitleAlign: "center",
                    headerShadowVisible: false, // Disables the visible shadow/separator on bottom of the header
                    animation: Platform.OS === "ios" ? "default" : "default"    // for some reason was set to none, idk
                }}
                >
                    <Stack.Screen
                        name="Root"
                        component={Root}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="AppSetup"
                        component={AppSetup}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name={"InitialVideoDownload"}
                        component={InitialVideoDownload}
                        options={{
                            title: "",
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: COLORS.dark
                            }
                        }}
                    />


                    <Stack.Screen
                        name="Landing"
                        component={Landing}
                        options={{
                            title: "",
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: COLORS.dark
                            }
                        }}
                    />


                    <Stack.Screen
                        name="InitialConfiguration"
                        component={InitialConfiguration}
                        options={{
                            title: "",
                            headerShown: false,
                            headerStyle: {
                                backgroundColor: COLORS.dark
                            }
                        }}
                    />



                    <Stack.Screen
                        name={"InitialConfigFailure"}
                        component={InitialConfigFailure}
                        options={{
                            title: "",
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: COLORS.dark
                            }
                        }}
                    />
                    <Stack.Screen
                        name={"InitialConfigSuccess"}
                        component={InitialConfigSuccess}
                        options={{
                            title: "",
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: COLORS.dark,
                            }
                        }}
                    />
                    <Stack.Screen
                        name="NoConnection"
                        component={NoConnection}
                        options={{
                            title: "",
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name={"VideoPlayer"}
                        component={VideoPlayer}
                        options={{
                            title: "",
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="Blackness"
                        component={Blackness}
                        options={{
                            title: "",
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="ServerError"
                        component={ServerError}
                        options={{
                            title: "",
                            headerShown: false
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

export default App