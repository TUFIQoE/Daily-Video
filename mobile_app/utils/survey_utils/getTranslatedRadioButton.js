import i18next from "i18next";

export const getTranslatedRadioButton = (button) => {
    if(!button.button_text){
        return ""
    }

    const current_lang_code = i18next.language
    const texts = button?.button_text


    for(let i=0; i<texts.length; i++){
        if(texts[i].language === current_lang_code){
            return texts[i].text
        }
    }
}