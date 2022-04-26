import createGain from "@/hooks/audio/createGain";
import createTransposition from "@/hooks/audio/createTransposition";

function MicrophonePlayback() {
    createGain();
    createTransposition();

    return <></>;
}

export default MicrophonePlayback;
