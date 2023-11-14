export const removeWhitespaces = text => {
    return text.replace(/\s/g, "")
}

export const isBlankString = text => {
    return (!text || /^\s*$/.test(text));
}