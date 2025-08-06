export const checkSVG = (uri) => {
    if (!uri || uri.endsWith(".svg")) {
        return true;
    }
    return false;
};
