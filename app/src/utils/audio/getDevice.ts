export const getDevice = () => {
    navigator.mediaDevices.getUserMedia =
        navigator.mediaDevices.getUserMedia ||
        // @ts-ignore
        navigator.mediaDevices.webkitGetUserMedia ||
        // @ts-ignore
        navigator.mediaDevices.mozGetUserMedia ||
        // @ts-ignore
        navigator.mediaDevices.msGetUserMedia;
    return navigator.mediaDevices.getUserMedia({ audio: true });
};