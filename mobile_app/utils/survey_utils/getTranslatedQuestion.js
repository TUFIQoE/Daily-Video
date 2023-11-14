import i18next from "i18next";

const getTranslatedQuestion = (survey, index) => {
    const language_code = i18next.language
    for(let i=0; i<survey[index].description.length; i++){

        if(survey[index].description[i].language === language_code){
            return survey[index].description[i].text
        }
    }
}

export default getTranslatedQuestion