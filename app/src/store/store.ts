import type { Device } from "@/interfaces/Device";
import { createStore } from "solid-js/store";
import type { KnobName, AmpSetting } from "@/types/AmpSettings";
import { Accessor } from "solid-js";
interface Store {
    inputDevice: Device | null;
    outputDevice: Device | null;
    Transpose: AmpSetting<number>;
    Volume: AmpSetting<number>;
    Gain: AmpSetting<number>;
    Low: AmpSetting<number>;
    Mid: AmpSetting<number>;
    High: AmpSetting<number>;
    Delay: AmpSetting<boolean>;
    Reverb: AmpSetting<boolean>;
    Distortion: AmpSetting<boolean>;
}

export const initialStoreState: Store = {
    inputDevice: null,
    outputDevice: null,
    Transpose: { value: 0 },
    Volume: { value: 50 },
    Gain: { value: 0 },
    Low: { value: 50 },
    Mid: { value: 50 },
    High: { value: 50 },
    Delay: { value: false },
    Reverb: { value: false },
    Distortion: { value: false },
};

export const [store, setStore] = createStore<Store>(initialStoreState);

export const setInputDevice = ({ device }: { device: Device }) => {
    setStore("inputDevice", () => device);
};
export const setOutputDevice = ({ device }: { device: Device }) => {
    setStore("outputDevice", () => device);
};

export const setSettingValue = ({
    knob,
    value,
}: {
    knob: KnobName;
    value: number | boolean;
}) => {
    setStore(knob, () => ({ value }));
};
