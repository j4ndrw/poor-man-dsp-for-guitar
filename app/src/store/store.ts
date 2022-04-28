import { createStore } from "solid-js/store";
import type { AmpSetting } from "@/types/AmpSettings";
import { createSignal } from "solid-js";
import { IAudioAPI } from "@/interfaces/IAudioAPI";

// No idea how to make solid-js/store work, so I'll use signals instead.
// If you find a way to use the store, feel free to submit a pull request

interface Store {
    audio: IAudioAPI | null;
    Gain: AmpSetting<number>;
    Low: AmpSetting<number>;
    Mid: AmpSetting<number>;
    High: AmpSetting<number>;
    Distortion: AmpSetting<number>;
    Chorus: AmpSetting<boolean>;
    Delay: AmpSetting<boolean>;
    Reverb: AmpSetting<boolean>;
}

export const initialStoreState: Store = {
    audio: null,
    Gain: { value: 0 },
    Low: { value: 50 },
    Mid: { value: 50 },
    High: { value: 50 },
    Distortion: { value: 0 },
    Chorus: { value: false },
    Delay: { value: false },
    Reverb: { value: false },
};

export const [store, setStore] = createSignal<Store>(initialStoreState);
