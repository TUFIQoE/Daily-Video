import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import eng from "./languages/eng"
import pol from "./languages/pol"
import nor from "./languages/nor"
import {SUPPORTED_LANGUAGES} from "./config";


export const LANGUAGES = {
    eng,
    pol,
    nor
}
export const LANG_CODES = Object.keys(LANGUAGES)


const LANGUAGE_DETECTOR = {
    type: 'languageDetector',
    async: true,
    detect: callback => {
        AsyncStorage.getItem('language', (err, language) => {
            // if error fetching stored data or no language was stored
            // display errors when in DEV mode as console statements
            if (err || !language) {
                if (err) {
                    console.log('Error fetching Languages from asyncstorage ', err);
                } else {
                    console.log('No language is set, choosing English as fallback');
                }
                if(SUPPORTED_LANGUAGES.ENG){
                    callback("eng")
                }
                else if(SUPPORTED_LANGUAGES.POL){
                    callback("pol")
                }
                else if(SUPPORTED_LANGUAGES.NOR){
                    callback("nor")
                }

                return;
            }
            callback(language);
        });
    },
    init: () => {

    },
    cacheUserLanguage: language => {
        AsyncStorage.setItem('language', language);
    }
};

i18next
    // detect language
    .use(LANGUAGE_DETECTOR)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // set options
    .init({
        resources: LANGUAGES,
        react: {
            useSuspense: false
        },
        interpolation: {
            escapeValue: false
        },
        compatibilityJSON: "v3" // <-- IMPORTANT default JSONv4 does not work on Android (simulator and device)
    });