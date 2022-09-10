export const scrollToBottom = (elementid) => {
    const theElement = document.getElementById(elementid);
    if (theElement) {
        theElement.scrollTop = theElement.scrollHeight;
    }
}
